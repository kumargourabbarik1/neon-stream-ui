from datetime import timedelta

from django.contrib.auth import get_user_model
from django.db.models import Count, Sum
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from .models import AuditLog, ContactMessage, Episode, Genre, PlatformSetting, Report, Title, WatchList, WatchProgress
from .permissions import IsAdminRole, IsSuperAdminRole
from .serializers import (
    AdminUserSerializer,
    AdminLoginSerializer,
    AuditLogSerializer,
    ContactMessageSerializer,
    EpisodeSerializer,
    GenreSerializer,
    PlatformSettingSerializer,
    ReportSerializer,
    TitleSerializer,
    TwoFactorChallengeSerializer,
    TwoFactorSetupSerializer,
    UserSerializer,
    WatchProgressSerializer,
)
from .services import (
    audit,
    consume_backup_code,
    create_enrollment_device,
    generate_backup_codes,
    issue_privileged_tokens,
    make_two_factor_challenge,
    resolve_two_factor_challenge,
    verify_totp,
)

User = get_user_model()


class AdminLoginView(APIView):
    """Validate the password and issue a short-lived, no-access MFA challenge."""

    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "admin_auth"

    def post(self, request):
        serializer = AdminLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        device = getattr(user, "two_factor", None)
        purpose = "enroll" if not device or not device.is_confirmed else "verify"
        audit(request, "auth.password_verified", user.email, actor=user)
        return Response(
            {
                "two_factor_required": True,
                "requires_enrollment": purpose == "enroll",
                "challenge": make_two_factor_challenge(user, purpose),
            }
        )


class AdminTwoFactorSetupView(APIView):
    """Provide a QR code only after a valid staff password challenge."""

    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "admin_auth"

    def post(self, request):
        serializer = TwoFactorSetupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            user = resolve_two_factor_challenge(serializer.validated_data["challenge"], "enroll", User)
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        if user is None or not user.is_platform_admin:
            return Response({"detail": "Invalid two-factor enrollment challenge."}, status=status.HTTP_400_BAD_REQUEST)
        if getattr(user, "two_factor", None) and user.two_factor.is_confirmed:
            return Response({"detail": "Two-factor authentication is already enrolled."}, status=status.HTTP_409_CONFLICT)
        _, manual_key, qr_code = create_enrollment_device(user)
        audit(request, "auth.2fa.setup_started", user.email, actor=user)
        return Response({"manual_key": manual_key, "qr_code": qr_code})


class AdminTwoFactorConfirmView(APIView):
    """Confirm the first authenticator code and return recovery codes once."""

    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "admin_auth"

    def post(self, request):
        serializer = TwoFactorChallengeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            user = resolve_two_factor_challenge(serializer.validated_data["challenge"], "enroll", User)
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        device = getattr(user, "two_factor", None) if user else None
        if user is None or not user.is_platform_admin or device is None or device.is_confirmed:
            return Response({"detail": "Invalid two-factor enrollment challenge."}, status=status.HTTP_400_BAD_REQUEST)
        if not verify_totp(device, serializer.validated_data["code"]):
            return Response({"detail": "Invalid authenticator code."}, status=status.HTTP_400_BAD_REQUEST)

        device.is_confirmed = True
        device.confirmed_at = timezone.now()
        device.save(update_fields=["is_confirmed", "confirmed_at", "updated_at"])
        backup_codes = generate_backup_codes(user)
        audit(request, "auth.2fa.enrolled", user.email, actor=user)
        return Response({**issue_privileged_tokens(user), "user": UserSerializer(user).data, "backup_codes": backup_codes})


class AdminTwoFactorVerifyView(APIView):
    """Complete a normal privileged login with a fresh TOTP or backup code."""

    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "admin_auth"

    def post(self, request):
        serializer = TwoFactorChallengeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            user = resolve_two_factor_challenge(serializer.validated_data["challenge"], "verify", User)
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        device = getattr(user, "two_factor", None) if user else None
        if user is None or not user.is_platform_admin or device is None or not device.is_confirmed:
            return Response({"detail": "Invalid two-factor verification challenge."}, status=status.HTTP_400_BAD_REQUEST)

        verified = verify_totp(device, serializer.validated_data["code"])
        used_backup = False
        if not verified:
            used_backup = consume_backup_code(user, serializer.validated_data["code"])
        if not verified and not used_backup:
            return Response({"detail": "Invalid authenticator or backup code."}, status=status.HTTP_400_BAD_REQUEST)

        audit(request, "auth.login", user.email, {"backup_code": used_backup}, actor=user)
        return Response({**issue_privileged_tokens(user), "user": UserSerializer(user).data})


class TitleViewSet(viewsets.ModelViewSet):
    serializer_class = TitleSerializer
    lookup_field = "slug"
    search_fields = ("name", "studio", "synopsis")

    def get_permissions(self):
        if self.request.method in ("POST", "PUT", "PATCH", "DELETE"):
            return [IsAdminRole()]
        return [IsAuthenticatedOrReadOnly()]

    def get_queryset(self):
        queryset = Title.objects.prefetch_related("genres", "episodes")
        user = self.request.user
        if not (user.is_authenticated and getattr(user, "is_platform_admin", False)):
            queryset = queryset.filter(is_published=True)
        params = self.request.query_params
        if kind := params.get("kind"):
            queryset = queryset.filter(kind=kind)
        if genre := params.get("genre"):
            queryset = queryset.filter(genres__slug=genre)
        if search := params.get("search"):
            queryset = queryset.filter(name__icontains=search)
        ordering = params.get("ordering")
        if ordering == "newest":
            queryset = queryset.order_by("-year", "-created_at")
        elif ordering == "rating":
            queryset = queryset.order_by("-rating")
        elif ordering == "views":
            queryset = queryset.order_by("-view_count")
        return queryset.distinct()

    def perform_create(self, serializer):
        title = serializer.save()
        audit(self.request, "content.create", title.name)

    def perform_update(self, serializer):
        title = serializer.save()
        audit(self.request, "content.update", title.name)

    def perform_destroy(self, instance):
        audit(self.request, "content.delete", instance.name)
        instance.delete()

    @action(detail=False, methods=["get"])
    def trending(self, request):
        return Response(self.get_serializer(self.get_queryset().filter(trending=True).order_by("-view_count")[:12], many=True).data)

    @action(detail=False, methods=["get"], url_path="new-releases")
    def new_releases(self, request):
        return Response(self.get_serializer(self.get_queryset().order_by("-year", "-created_at")[:12], many=True).data)

    @action(detail=False, methods=["get"], url_path="top-rated")
    def top_rated(self, request):
        return Response(self.get_serializer(self.get_queryset().order_by("-rating")[:12], many=True).data)

    @action(detail=True, methods=["get"])
    def episodes(self, request, slug=None):
        title = self.get_object()
        return Response(EpisodeSerializer(title.episodes.all(), many=True).data)


class GenreViewSet(viewsets.ModelViewSet):
    serializer_class = GenreSerializer
    lookup_field = "slug"

    def get_permissions(self):
        return [IsAdminRole()] if self.request.method not in ("GET", "HEAD", "OPTIONS") else [AllowAny()]

    def get_queryset(self):
        queryset = Genre.objects.annotate(title_count=Count("titles", distinct=True))
        if not (self.request.user.is_authenticated and getattr(self.request.user, "is_platform_admin", False)):
            queryset = queryset.filter(is_active=True)
        return queryset

    def perform_create(self, serializer):
        genre = serializer.save()
        audit(self.request, "genre.create", genre.name)

    def perform_update(self, serializer):
        genre = serializer.save()
        audit(self.request, "genre.update", genre.name)

    def perform_destroy(self, instance):
        audit(self.request, "genre.delete", instance.name)
        instance.delete()


class EpisodeViewSet(viewsets.ModelViewSet):
    serializer_class = EpisodeSerializer

    def get_permissions(self):
        return [IsAdminRole()] if self.request.method not in ("GET", "HEAD", "OPTIONS") else [AllowAny()]

    def get_queryset(self):
        queryset = Episode.objects.select_related("title")
        if title_slug := self.request.query_params.get("title"):
            queryset = queryset.filter(title__slug=title_slug)
        if not (self.request.user.is_authenticated and getattr(self.request.user, "is_platform_admin", False)):
            queryset = queryset.filter(title__is_published=True)
        return queryset


class LibraryListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        titles = [entry.title for entry in WatchList.objects.filter(user=request.user).select_related("title").prefetch_related("title__genres", "title__episodes")]
        return Response(TitleSerializer(titles, many=True, context={"request": request}).data)


class LibraryItemView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, slug):
        title = get_object_or_404(Title, slug=slug, is_published=True)
        _, created = WatchList.objects.get_or_create(user=request.user, title=title)
        return Response({"detail": "Added to your list.", "created": created}, status=201 if created else 200)

    def delete(self, request, slug):
        deleted, _ = WatchList.objects.filter(user=request.user, title__slug=slug).delete()
        return Response(status=204 if deleted else 404)


class ProgressView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        progress = WatchProgress.objects.filter(user=request.user).select_related("title", "episode").prefetch_related("title__genres", "title__episodes")
        return Response(WatchProgressSerializer(progress, many=True, context={"request": request}).data)

    def put(self, request):
        title_slug = request.data.get("title")
        title = get_object_or_404(Title, slug=title_slug, is_published=True)
        progress, _ = WatchProgress.objects.get_or_create(user=request.user, title=title)
        payload = request.data.copy()
        payload["title"] = title.slug
        serializer = WatchProgressSerializer(progress, data=payload, context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)
        return Response(serializer.data)


class ReportViewSet(viewsets.ModelViewSet):
    serializer_class = ReportSerializer
    http_method_names = ["get", "post", "patch", "head", "options"]

    def get_permissions(self):
        if self.request.method == "OPTIONS":
            return [AllowAny()]
        return [IsAuthenticated()] if self.action == "create" else [IsAdminRole()]

    def get_queryset(self):
        queryset = Report.objects.select_related("reporter", "reviewed_by")
        if getattr(self.request.user, "is_platform_admin", False):
            return queryset
        return queryset.none()

    def perform_create(self, serializer):
        serializer.save(reporter=self.request.user)

    @action(detail=True, methods=["post"])
    def resolve(self, request, pk=None):
        report = self.get_object()
        report.status = Report.Status.RESOLVED
        report.reviewed_by = request.user
        report.reviewed_at = timezone.now()
        report.save(update_fields=["status", "reviewed_by", "reviewed_at"])
        audit(request, "report.resolve", f"Report {report.pk}")
        return Response(self.get_serializer(report).data)

    @action(detail=True, methods=["post"])
    def dismiss(self, request, pk=None):
        report = self.get_object()
        report.status = Report.Status.DISMISSED
        report.reviewed_by = request.user
        report.reviewed_at = timezone.now()
        report.save(update_fields=["status", "reviewed_by", "reviewed_at"])
        audit(request, "report.dismiss", f"Report {report.pk}")
        return Response(self.get_serializer(report).data)


class AdminUserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by("-date_joined")
    serializer_class = AdminUserSerializer
    permission_classes = [IsSuperAdminRole]
    http_method_names = ["get", "post", "patch", "delete", "head", "options"]

    def get_queryset(self):
        return self.queryset.filter(role=User.Role.ADMIN)

    def create(self, request, *args, **kwargs):
        if request.data.get("role", User.Role.ADMIN) != User.Role.ADMIN:
            return Response({"detail": "This endpoint may create admin accounts only."}, status=status.HTTP_403_FORBIDDEN)
        response = super().create(request, *args, **kwargs)
        audit(request, "admin.create", response.data["email"])
        return response

    def update(self, request, *args, **kwargs):
        target = self.get_object()
        requested_role = request.data.get("role")
        if requested_role and requested_role != User.Role.ADMIN:
            return Response({"detail": "Admin accounts cannot be promoted from this endpoint."}, status=status.HTTP_403_FORBIDDEN)
        response = super().update(request, *args, **kwargs)
        audit(request, "user.update", target.email)
        return response

    def destroy(self, request, *args, **kwargs):
        target = self.get_object()
        if target == request.user:
            return Response({"detail": "You cannot delete your own account."}, status=400)
        audit(request, "user.delete", target.email)
        return super().destroy(request, *args, **kwargs)

    @action(detail=True, methods=["post"])
    def suspend(self, request, pk=None):
        target = self.get_object()
        target.status = User.Status.SUSPENDED
        target.is_active = False
        target.save(update_fields=["status", "is_active"])
        audit(request, "user.suspend", target.email)
        return Response(self.get_serializer(target).data)

    @action(detail=True, methods=["post"], url_path="reset-password")
    def reset_password(self, request, pk=None):
        target = self.get_object()
        audit(request, "user.reset-password", target.email)
        return Response({"detail": "Password reset has been queued. Configure email delivery for production."}, status=202)


class AuditLogViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    serializer_class = AuditLogSerializer
    permission_classes = [IsSuperAdminRole]

    def get_queryset(self):
        queryset = AuditLog.objects.select_related("actor")
        if action_name := self.request.query_params.get("action"):
            queryset = queryset.filter(action=action_name)
        if date := self.request.query_params.get("date"):
            queryset = queryset.filter(created_at__date=date)
        return queryset


class DashboardView(APIView):
    permission_classes = [IsAdminRole]

    def get(self, request):
        stats = {
            "total_users": User.objects.count(),
            "total_titles": Title.objects.count(),
            "total_views": Title.objects.aggregate(total=Sum("view_count"))["total"] or 0,
            "active_streams": WatchProgress.objects.filter(updated_at__gte=timezone.now() - timedelta(minutes=10)).count(),
            "open_reports": Report.objects.filter(status=Report.Status.OPEN).count(),
        }
        return Response(stats)


class SystemHealthView(APIView):
    permission_classes = [IsSuperAdminRole]

    def get(self, request):
        # The application database was reached while computing dashboard data.
        return Response({
            "database": {"status": "ok"},
            "api": {"status": "ok"},
            "catalogue": {"published_titles": Title.objects.filter(is_published=True).count()},
            "pending_reports": Report.objects.filter(status=Report.Status.OPEN).count(),
        })


class PlatformSettingView(APIView):
    permission_classes = [IsSuperAdminRole]

    def get(self, request):
        return Response(PlatformSettingSerializer(PlatformSetting.objects.all(), many=True).data)

    def put(self, request):
        serializer = PlatformSettingSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        setting, _ = PlatformSetting.objects.update_or_create(
            key=serializer.validated_data["key"],
            defaults={"value": serializer.validated_data["value"], "updated_by": request.user},
        )
        audit(request, "settings.update", setting.key)
        return Response(PlatformSettingSerializer(setting).data)


class ContactMessageView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ContactMessageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"detail": "Thanks — your message has been received."}, status=201)
