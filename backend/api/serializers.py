from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import (
    AuditLog,
    ContactMessage,
    Episode,
    Genre,
    PlatformSetting,
    Report,
    Title,
    User,
    WatchProgress,
)


class UserSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="display_name", read_only=True)
    tier = serializers.CharField(source="membership", read_only=True)

    class Meta:
        model = User
        fields = ("id", "email", "name", "role", "tier", "status", "avatar_url", "date_joined")
        read_only_fields = ("id", "email", "role", "tier", "status", "date_joined")


class ProfileSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="display_name", required=False)

    class Meta:
        model = User
        fields = ("id", "email", "name", "first_name", "last_name", "avatar_url", "membership", "role", "status")
        read_only_fields = ("id", "email", "membership", "role", "status")


class RegistrationSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(validators=[])
    name = serializers.CharField(source="display_name", max_length=120, required=False)
    password = serializers.CharField(write_only=True, min_length=8, style={"input_type": "password"})

    class Meta:
        model = User
        fields = ("email", "password", "name")

    def validate_email(self, value):
        normalized = value.strip().lower()
        if User.objects.filter(email__iexact=normalized).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return normalized

    def create(self, validated_data):
        password = validated_data.pop("password")
        email = validated_data.pop("email")
        user = User(email=email, username=email, **validated_data)
        user.set_password(password)
        user.save()
        return user


class MovizoTokenSerializer(TokenObtainPairSerializer):
    username_field = "email"

    def validate(self, attrs):
        email = attrs.get("email", "").lower()
        password = attrs.get("password")
        user = User.objects.filter(email=email).first()
        if user is None or not user.check_password(password):
            user = None
        if not user:
            raise serializers.ValidationError({"detail": "No active account found with these credentials."})
        if user.status == User.Status.SUSPENDED:
            raise serializers.ValidationError({"detail": "This account has been suspended."})
        if not user.is_active:
            raise serializers.ValidationError({"detail": "This account is inactive."})
        refresh = self.get_token(user)
        return {"refresh": str(refresh), "access": str(refresh.access_token), "user": UserSerializer(user).data}


class AdminLoginSerializer(serializers.Serializer):
    """First factor only; this endpoint never returns a session token."""

    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, trim_whitespace=False)

    def validate(self, attrs):
        email = attrs["email"].strip().lower()
        user = User.objects.filter(email__iexact=email).first()
        if (
            user is None
            or not user.check_password(attrs["password"])
            or not user.is_active
            or user.status == User.Status.SUSPENDED
            or not user.is_platform_admin
        ):
            raise serializers.ValidationError({"detail": "Invalid privileged account credentials."})
        attrs["user"] = user
        return attrs


class TwoFactorChallengeSerializer(serializers.Serializer):
    challenge = serializers.CharField()
    code = serializers.CharField(max_length=32)


class TwoFactorSetupSerializer(serializers.Serializer):
    challenge = serializers.CharField()


class GenreSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="slug", read_only=True)
    title_count = serializers.IntegerField(read_only=True, default=0)
    art = serializers.URLField(source="image_url", required=False, allow_blank=True)

    class Meta:
        model = Genre
        fields = ("id", "name", "slug", "description", "art", "is_active", "title_count")
        read_only_fields = ("id", "title_count")


class EpisodeSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    title = serializers.CharField(source="name")
    parent_title = serializers.SlugRelatedField(
        source="title", slug_field="slug", queryset=Title.objects.all(), write_only=True, required=False
    )
    duration = serializers.SerializerMethodField()
    thumb = serializers.URLField(source="thumbnail_url", required=False, allow_blank=True)

    class Meta:
        model = Episode
        fields = (
            "id", "title", "parent_title", "season_number", "number", "duration", "duration_seconds",
            "thumb", "synopsis", "video_url", "published_at",
        )
        read_only_fields = ("id", "duration")

    def get_duration(self, instance):
        minutes, seconds = divmod(instance.duration_seconds, 60)
        return f"{minutes}m" if not seconds else f"{minutes}m {seconds}s"


class TitleSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="slug", read_only=True)
    name = serializers.CharField()
    seasons = serializers.IntegerField(source="season_count", required=False)
    genres = GenreSerializer(many=True, read_only=True)
    genre_ids = serializers.PrimaryKeyRelatedField(
        source="genres", queryset=Genre.objects.all(), many=True, write_only=True, required=False
    )
    episodes = serializers.SerializerMethodField()
    poster = serializers.URLField(source="poster_url", required=False, allow_blank=True)
    banner = serializers.URLField(source="banner_url", required=False, allow_blank=True)
    views = serializers.SerializerMethodField()
    progress = serializers.SerializerMethodField()

    class Meta:
        model = Title
        fields = (
            "id", "name", "slug", "kind", "year", "rating", "episodes", "seasons", "status",
            "genres", "genre_ids", "studio", "synopsis", "poster", "banner", "trailer_url", "video_url",
            "trending", "views", "view_count", "progress", "is_published", "created_at", "updated_at",
        )
        read_only_fields = ("id", "episodes", "views", "progress", "created_at", "updated_at")

    def get_episodes(self, instance):
        return getattr(instance, "episode_total", None) or instance.episodes.count()

    def get_views(self, instance):
        count = instance.view_count
        return f"{count / 1_000_000:.1f}M" if count >= 1_000_000 else str(count)

    def get_progress(self, instance):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return None
        progress = instance.progress_entries.filter(user=request.user).only("progress_percent").first()
        return float(progress.progress_percent) if progress else None


class WatchProgressSerializer(serializers.ModelSerializer):
    title = serializers.SlugRelatedField(slug_field="slug", queryset=Title.objects.all())
    title_detail = TitleSerializer(source="title", read_only=True)
    episode = serializers.PrimaryKeyRelatedField(queryset=Episode.objects.all(), required=False, allow_null=True)

    class Meta:
        model = WatchProgress
        fields = ("id", "title", "title_detail", "episode", "position_seconds", "progress_percent", "updated_at")
        read_only_fields = ("id", "title_detail", "updated_at")

    def validate(self, attrs):
        episode = attrs.get("episode")
        title = attrs.get("title")
        if episode and title and episode.title_id != title.id:
            raise serializers.ValidationError({"episode": "The episode does not belong to this title."})
        return attrs


class ReportSerializer(serializers.ModelSerializer):
    reporter = UserSerializer(read_only=True)
    reviewed_by = UserSerializer(read_only=True)

    class Meta:
        model = Report
        fields = (
            "id", "target_type", "target_label", "reason", "details", "severity", "status",
            "reporter", "reviewed_by", "created_at", "reviewed_at",
        )
        read_only_fields = ("id", "status", "reporter", "reviewed_by", "created_at", "reviewed_at")


class AdminUserSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="display_name", required=False)
    joined = serializers.DateTimeField(source="date_joined", read_only=True)
    password = serializers.CharField(write_only=True, required=False, min_length=12)
    two_factor_enrolled = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            "id",
            "name",
            "email",
            "role",
            "status",
            "password",
            "two_factor_enrolled",
            "joined",
            "is_active",
        )
        read_only_fields = ("id", "two_factor_enrolled", "joined")

    def get_two_factor_enrolled(self, instance):
        device = getattr(instance, "two_factor", None)
        return bool(device and device.is_confirmed)

    def validate_email(self, value):
        normalized = value.strip().lower()
        queryset = User.objects.filter(email__iexact=normalized)
        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)
        if queryset.exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return normalized

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        if not password:
            raise serializers.ValidationError({"password": "A temporary password is required."})
        email = validated_data["email"]
        user = User(username=email, **validated_data)
        user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        user = super().update(instance, validated_data)
        if password:
            user.set_password(password)
            user.save(update_fields=["password"])
        return user


class AuditLogSerializer(serializers.ModelSerializer):
    admin = serializers.CharField(source="actor.display_name", read_only=True, default="System")
    timestamp = serializers.DateTimeField(source="created_at", read_only=True)
    ip = serializers.IPAddressField(source="ip_address", read_only=True, allow_null=True)

    class Meta:
        model = AuditLog
        fields = ("id", "admin", "action", "target", "ip", "metadata", "timestamp")


class PlatformSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlatformSetting
        fields = ("key", "value", "updated_at")
        read_only_fields = ("updated_at",)


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ("id", "name", "email", "subject", "message", "created_at")
        read_only_fields = ("id", "created_at")
