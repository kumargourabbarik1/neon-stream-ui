from django.contrib.auth import authenticate, login, logout
from django.contrib.auth import get_user_model
from django.contrib import messages
from django.db.models import Sum
from django.shortcuts import get_object_or_404, redirect, render
from django.utils import timezone
from datetime import timedelta
from django.views import View

from api.models import (
    AuditLog, Genre, PlatformSetting, Report, Title, WatchProgress
)
from .forms import DashboardLoginForm, GenreForm, PlatformSettingForm, TitleForm

User = get_user_model()

# ── Auth helpers ───────────────────────────────────────────────────────────────

def _require_admin(request):
    """Return None if ok, else a redirect response."""
    if not request.user.is_authenticated or not getattr(request.user, "is_platform_admin", False):
        return redirect("dashboard:login")
    return None


def _require_superadmin(request):
    if not request.user.is_authenticated or request.user.role != request.user.Role.SUPERADMIN:
        return redirect("dashboard:login")
    return None


def _ctx(request, extra=None):
    ctx = {
        "admin_user": request.user,
        "is_superadmin": getattr(request.user, "role", None) == User.Role.SUPERADMIN
        if hasattr(User, "Role") else False,
    }
    if extra:
        ctx.update(extra)
    return ctx


# ── Login / Logout ─────────────────────────────────────────────────────────────

class LoginView(View):
    template_name = "dashboard/login.html"

    def get(self, request):
        if request.user.is_authenticated and getattr(request.user, "is_platform_admin", False):
            return redirect("dashboard:overview")
        return render(request, self.template_name, {"form": DashboardLoginForm()})

    def post(self, request):
        form = DashboardLoginForm(request.POST)
        if form.is_valid():
            user = authenticate(
                request,
                username=form.cleaned_data["email"],
                password=form.cleaned_data["password"],
            )
            if user and getattr(user, "is_platform_admin", False):
                login(request, user)
                return redirect("dashboard:overview")
            messages.error(request, "Invalid credentials or insufficient privileges.")
        return render(request, self.template_name, {"form": form})


class LogoutView(View):
    def get(self, request):
        logout(request)
        return redirect("dashboard:login")


# ── Overview ───────────────────────────────────────────────────────────────────

class OverviewView(View):
    def get(self, request):
        if redir := _require_admin(request):
            return redir
        stats = {
            "total_titles": Title.objects.count(),
            "total_views":  Title.objects.aggregate(t=Sum("view_count"))["t"] or 0,
            "open_reports": Report.objects.filter(status=Report.Status.OPEN).count(),
            "active_streams": WatchProgress.objects.filter(
                updated_at__gte=timezone.now() - timedelta(minutes=10)
            ).count(),
        }
        if _ctx(request)["is_superadmin"]:
            stats["total_users"] = User.objects.count()
        recent_reports = Report.objects.filter(status=Report.Status.OPEN).order_by("-created_at")[:5]
        return render(request, "dashboard/overview.html",
                      _ctx(request, {"stats": stats, "recent_reports": recent_reports}))


# ── Titles ─────────────────────────────────────────────────────────────────────

class TitleListView(View):
    def get(self, request):
        if redir := _require_admin(request):
            return redir
        q = request.GET.get("q", "")
        titles = Title.objects.prefetch_related("genres").order_by("-created_at")
        if q:
            titles = titles.filter(name__icontains=q)
        return render(request, "dashboard/titles.html",
                      _ctx(request, {"titles": titles, "q": q}))


class TitleAddView(View):
    template_name = "dashboard/title_form.html"

    def get(self, request):
        if redir := _require_admin(request):
            return redir
        return render(request, self.template_name, _ctx(request, {"form": TitleForm(), "action": "Add"}))

    def post(self, request):
        if redir := _require_admin(request):
            return redir
        form = TitleForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, "Title created.")
            return redirect("dashboard:titles")
        return render(request, self.template_name, _ctx(request, {"form": form, "action": "Add"}))


class TitleEditView(View):
    template_name = "dashboard/title_form.html"

    def get(self, request, pk):
        if redir := _require_admin(request):
            return redir
        title = get_object_or_404(Title, pk=pk)
        return render(request, self.template_name,
                      _ctx(request, {"form": TitleForm(instance=title), "action": "Edit", "obj": title}))

    def post(self, request, pk):
        if redir := _require_admin(request):
            return redir
        title = get_object_or_404(Title, pk=pk)
        form = TitleForm(request.POST, instance=title)
        if form.is_valid():
            form.save()
            messages.success(request, f'"{title.name}" updated.')
            return redirect("dashboard:titles")
        return render(request, self.template_name,
                      _ctx(request, {"form": form, "action": "Edit", "obj": title}))


class TitleDeleteView(View):
    def post(self, request, pk):
        if redir := _require_admin(request):
            return redir
        title = get_object_or_404(Title, pk=pk)
        title.delete()
        messages.success(request, "Title deleted.")
        return redirect("dashboard:titles")


# ── Genres ─────────────────────────────────────────────────────────────────────

class GenreListView(View):
    def get(self, request):
        if redir := _require_admin(request):
            return redir
        genres = Genre.objects.all().order_by("name")
        return render(request, "dashboard/genres.html", _ctx(request, {"genres": genres}))


class GenreAddView(View):
    template_name = "dashboard/genre_form.html"

    def get(self, request):
        if redir := _require_admin(request):
            return redir
        return render(request, self.template_name, _ctx(request, {"form": GenreForm(), "action": "Add"}))

    def post(self, request):
        if redir := _require_admin(request):
            return redir
        form = GenreForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, "Genre created.")
            return redirect("dashboard:genres")
        return render(request, self.template_name, _ctx(request, {"form": form, "action": "Add"}))


class GenreEditView(View):
    template_name = "dashboard/genre_form.html"

    def get(self, request, pk):
        if redir := _require_admin(request):
            return redir
        genre = get_object_or_404(Genre, pk=pk)
        return render(request, self.template_name,
                      _ctx(request, {"form": GenreForm(instance=genre), "action": "Edit", "obj": genre}))

    def post(self, request, pk):
        if redir := _require_admin(request):
            return redir
        genre = get_object_or_404(Genre, pk=pk)
        form = GenreForm(request.POST, instance=genre)
        if form.is_valid():
            form.save()
            messages.success(request, f'"{genre.name}" updated.')
            return redirect("dashboard:genres")
        return render(request, self.template_name,
                      _ctx(request, {"form": form, "action": "Edit", "obj": genre}))


class GenreDeleteView(View):
    def post(self, request, pk):
        if redir := _require_admin(request):
            return redir
        genre = get_object_or_404(Genre, pk=pk)
        genre.delete()
        messages.success(request, "Genre deleted.")
        return redirect("dashboard:genres")


# ── Reports ────────────────────────────────────────────────────────────────────

class ReportListView(View):
    def get(self, request):
        if redir := _require_admin(request):
            return redir
        status_filter = request.GET.get("status", "open")
        reports = Report.objects.select_related("reporter", "reviewed_by").order_by("-created_at")
        if status_filter in Report.Status.values:
            reports = reports.filter(status=status_filter)
        return render(request, "dashboard/reports.html",
                      _ctx(request, {"reports": reports, "status_filter": status_filter,
                                     "statuses": Report.Status.choices}))


class ReportResolveView(View):
    def post(self, request, pk):
        if redir := _require_admin(request):
            return redir
        report = get_object_or_404(Report, pk=pk)
        report.status = Report.Status.RESOLVED
        report.reviewed_by = request.user
        report.reviewed_at = timezone.now()
        report.save(update_fields=["status", "reviewed_by", "reviewed_at"])
        messages.success(request, "Report resolved.")
        return redirect("dashboard:reports")


class ReportDismissView(View):
    def post(self, request, pk):
        if redir := _require_admin(request):
            return redir
        report = get_object_or_404(Report, pk=pk)
        report.status = Report.Status.DISMISSED
        report.reviewed_by = request.user
        report.reviewed_at = timezone.now()
        report.save(update_fields=["status", "reviewed_by", "reviewed_at"])
        messages.success(request, "Report dismissed.")
        return redirect("dashboard:reports")


# ── Audit Log (super-admin) ────────────────────────────────────────────────────

class AuditLogView(View):
    def get(self, request):
        if redir := _require_superadmin(request):
            return redir
        logs = AuditLog.objects.select_related("actor").order_by("-created_at")[:200]
        return render(request, "dashboard/audit.html", _ctx(request, {"logs": logs}))


# ── Users (super-admin) ────────────────────────────────────────────────────────

class UserListView(View):
    def get(self, request):
        if redir := _require_superadmin(request):
            return redir
        users = User.objects.order_by("-date_joined")
        return render(request, "dashboard/users.html", _ctx(request, {"users": users}))


class UserSuspendView(View):
    def post(self, request, pk):
        if redir := _require_superadmin(request):
            return redir
        target = get_object_or_404(User, pk=pk)
        if target == request.user:
            messages.error(request, "You cannot suspend your own account.")
            return redirect("dashboard:users")
        target.status = User.Status.SUSPENDED
        target.is_active = False
        target.save(update_fields=["status", "is_active"])
        messages.success(request, f"{target.email} suspended.")
        return redirect("dashboard:users")


class UserActivateView(View):
    def post(self, request, pk):
        if redir := _require_superadmin(request):
            return redir
        target = get_object_or_404(User, pk=pk)
        target.status = User.Status.ACTIVE
        target.is_active = True
        target.save(update_fields=["status", "is_active"])
        messages.success(request, f"{target.email} re-activated.")
        return redirect("dashboard:users")


class UserAddView(View):
    template_name = "dashboard/user_form.html"

    def get(self, request):
        if redir := _require_superadmin(request):
            return redir
        return render(request, self.template_name, _ctx(request))

    def post(self, request):
        if redir := _require_superadmin(request):
            return redir
        email = request.POST.get("email", "").strip().lower()
        password = request.POST.get("password", "")
        display_name = request.POST.get("display_name", "").strip()
        role = request.POST.get("role", User.Role.ADMIN)

        errors = {}
        if not email:
            errors["email"] = "Email is required."
        elif User.objects.filter(email=email).exists():
            errors["email"] = "A user with this email already exists."
        if len(password) < 6:
            errors["password"] = "Password must be at least 6 characters."
        if role not in (User.Role.ADMIN, User.Role.SUPERADMIN):
            errors["non_field"] = "Invalid role selected."

        if errors:
            return render(request, self.template_name,
                          _ctx(request, {"errors": errors, "form_data": request.POST}))

        user = User(email=email, username=email, display_name=display_name, role=role, is_active=True)
        user.set_password(password)
        user.save()
        messages.success(request, f"Admin account {email} created.")
        return redirect("dashboard:users")


class UserDeleteView(View):
    def post(self, request, pk):
        if redir := _require_superadmin(request):
            return redir
        target = get_object_or_404(User, pk=pk)
        if target == request.user:
            messages.error(request, "You cannot delete your own account.")
            return redirect("dashboard:users")
        email = target.email
        target.delete()
        messages.success(request, f"{email} deleted.")
        return redirect("dashboard:users")


# ── Platform Settings (super-admin) ───────────────────────────────────────────

class SettingsView(View):
    template_name = "dashboard/settings.html"

    def get(self, request):
        if redir := _require_superadmin(request):
            return redir
        settings_qs = PlatformSetting.objects.all()
        return render(request, self.template_name,
                      _ctx(request, {"settings_list": settings_qs, "form": PlatformSettingForm()}))

    def post(self, request):
        if redir := _require_superadmin(request):
            return redir
        form = PlatformSettingForm(request.POST)
        if form.is_valid():
            PlatformSetting.objects.update_or_create(
                key=form.cleaned_data["key"],
                defaults={"value": form.cleaned_data["value"], "updated_by": request.user},
            )
            messages.success(request, f'Setting "{form.cleaned_data["key"]}" saved.')
            return redirect("dashboard:settings")
        settings_qs = PlatformSetting.objects.all()
        return render(request, self.template_name,
                      _ctx(request, {"settings_list": settings_qs, "form": form}))


class SettingDeleteView(View):
    def post(self, request, pk):
        if redir := _require_superadmin(request):
            return redir
        setting = get_object_or_404(PlatformSetting, pk=pk)
        setting.delete()
        messages.success(request, "Setting deleted.")
        return redirect("dashboard:settings")
