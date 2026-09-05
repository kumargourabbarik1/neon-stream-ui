from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.utils.text import slugify


class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = "admin", "Admin"
        SUPERADMIN = "superadmin", "Super Admin"

    class Membership(models.TextChoices):
        FREE = "free", "Free"
        STANDARD = "standard", "Standard"
        PREMIUM = "premium", "Premium"

    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        SUSPENDED = "suspended", "Suspended"

    email = models.EmailField(unique=True)
    display_name = models.CharField(max_length=120, blank=True)
    # Regular-viewer accounts are no longer issued. The legacy membership
    # fields remain temporarily to preserve existing database rows safely.
    role = models.CharField(max_length=16, choices=Role.choices, default=Role.ADMIN)
    membership = models.CharField(max_length=16, choices=Membership.choices, default=Membership.FREE)
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.ACTIVE)
    avatar_url = models.URLField(blank=True)

    def save(self, *args, **kwargs):
        self.email = self.email.lower()
        if not self.username:
            self.username = self.email
        if not self.display_name:
            self.display_name = self.get_full_name() or self.email.split("@")[0]
        if self.is_superuser:
            self.role = self.Role.SUPERADMIN
        self.is_staff = self.role in {self.Role.ADMIN, self.Role.SUPERADMIN}
        self.is_superuser = self.role == self.Role.SUPERADMIN
        super().save(*args, **kwargs)

    @property
    def is_platform_admin(self):
        return self.role in {self.Role.ADMIN, self.Role.SUPERADMIN}

    def __str__(self):
        return self.email


class AdminTwoFactor(models.Model):
    """Encrypted TOTP material for a single privileged account."""

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="two_factor")
    encrypted_secret = models.TextField()
    drift = models.IntegerField(default=0)
    last_verified_step = models.BigIntegerField(null=True, blank=True)
    is_confirmed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    confirmed_at = models.DateTimeField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"TOTP for {self.user.email}"


class BackupCode(models.Model):
    """One-time recovery code hashes; plaintext codes are never persisted."""

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="backup_codes")
    code_hash = models.CharField(max_length=256)
    created_at = models.DateTimeField(auto_now_add=True)
    used_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["created_at"]


class Genre(models.Model):
    name = models.CharField(max_length=80, unique=True)
    slug = models.SlugField(max_length=90, unique=True, blank=True)
    description = models.TextField(blank=True)
    image_url = models.URLField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Title(models.Model):
    class Kind(models.TextChoices):
        MOVIE = "movie", "Movie"
        SERIES = "series", "Series"

    class Status(models.TextChoices):
        ONGOING = "ongoing", "Ongoing"
        COMPLETED = "completed", "Completed"

    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=270, unique=True, blank=True)
    kind = models.CharField(max_length=10, choices=Kind.choices)
    year = models.PositiveSmallIntegerField(validators=[MinValueValidator(1888), MaxValueValidator(2100)])
    rating = models.DecimalField(max_digits=3, decimal_places=1, validators=[MinValueValidator(0), MaxValueValidator(10)])
    season_count = models.PositiveSmallIntegerField(default=1)
    status = models.CharField(max_length=12, choices=Status.choices, default=Status.ONGOING)
    genres = models.ManyToManyField(Genre, related_name="titles", blank=True)
    studio = models.CharField(max_length=160, blank=True)
    synopsis = models.TextField(blank=True)
    poster_url = models.URLField(blank=True)
    banner_url = models.URLField(blank=True)
    trailer_url = models.URLField(blank=True)
    video_url = models.URLField(blank=True)
    trending = models.BooleanField(default=False)
    view_count = models.PositiveBigIntegerField(default=0)
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at", "name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Episode(models.Model):
    title = models.ForeignKey(Title, on_delete=models.CASCADE, related_name="episodes")
    season_number = models.PositiveSmallIntegerField(default=1)
    number = models.PositiveSmallIntegerField()
    name = models.CharField(max_length=255)
    duration_seconds = models.PositiveIntegerField(default=0)
    synopsis = models.TextField(blank=True)
    thumbnail_url = models.URLField(blank=True)
    video_url = models.URLField(blank=True)
    published_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["season_number", "number"]
        constraints = [
            models.UniqueConstraint(fields=["title", "season_number", "number"], name="unique_episode_number")
        ]

    def __str__(self):
        return f"{self.title} S{self.season_number}E{self.number}"


class WatchList(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="watchlist_entries")
    title = models.ForeignKey(Title, on_delete=models.CASCADE, related_name="watchlisted_by")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        constraints = [models.UniqueConstraint(fields=["user", "title"], name="unique_watchlist_title")]


class WatchProgress(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="watch_progress")
    title = models.ForeignKey(Title, on_delete=models.CASCADE, related_name="progress_entries")
    episode = models.ForeignKey(Episode, on_delete=models.SET_NULL, related_name="progress_entries", null=True, blank=True)
    position_seconds = models.PositiveIntegerField(default=0)
    progress_percent = models.DecimalField(max_digits=5, decimal_places=2, default=0, validators=[MinValueValidator(0), MaxValueValidator(100)])
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-updated_at"]
        constraints = [models.UniqueConstraint(fields=["user", "title"], name="unique_title_progress")]


class Report(models.Model):
    class TargetType(models.TextChoices):
        COMMENT = "comment", "Comment"
        TITLE = "title", "Title"
        PROFILE = "profile", "Profile"

    class Severity(models.TextChoices):
        LOW = "low", "Low"
        MEDIUM = "medium", "Medium"
        HIGH = "high", "High"

    class Status(models.TextChoices):
        OPEN = "open", "Open"
        RESOLVED = "resolved", "Resolved"
        DISMISSED = "dismissed", "Dismissed"

    reporter = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="submitted_reports")
    target_type = models.CharField(max_length=12, choices=TargetType.choices)
    target_label = models.CharField(max_length=255)
    reason = models.CharField(max_length=255)
    details = models.TextField(blank=True)
    severity = models.CharField(max_length=10, choices=Severity.choices, default=Severity.MEDIUM)
    status = models.CharField(max_length=12, choices=Status.choices, default=Status.OPEN)
    reviewed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="reviewed_reports")
    created_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]


class AuditLog(models.Model):
    actor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="audit_events")
    action = models.CharField(max_length=120)
    target = models.CharField(max_length=255)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]


class PlatformSetting(models.Model):
    key = models.SlugField(max_length=80, unique=True)
    value = models.JSONField(default=dict)
    updated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["key"]


class ContactMessage(models.Model):
    name = models.CharField(max_length=120)
    email = models.EmailField()
    subject = models.CharField(max_length=255)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    handled_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]
