from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import AuditLog, ContactMessage, Episode, Genre, PlatformSetting, Report, Title, User, WatchList, WatchProgress


@admin.register(User)
class MovizoUserAdmin(UserAdmin):
    list_display = ("email", "display_name", "role", "membership", "status", "is_active")
    list_filter = ("role", "membership", "status", "is_active")
    search_fields = ("email", "display_name")
    fieldsets = UserAdmin.fieldsets + (
        ("Movizo", {"fields": ("display_name", "role", "membership", "status", "avatar_url")}),
    )


@admin.register(Title)
class TitleAdmin(admin.ModelAdmin):
    list_display = ("name", "kind", "year", "rating", "trending", "is_published")
    list_filter = ("kind", "status", "trending", "is_published")
    search_fields = ("name", "studio")
    prepopulated_fields = {"slug": ("name",)}
    filter_horizontal = ("genres",)


@admin.register(Genre)
class GenreAdmin(admin.ModelAdmin):
    list_display = ("name", "is_active")
    prepopulated_fields = {"slug": ("name",)}


admin.site.register([Episode, WatchList, WatchProgress, Report, AuditLog, PlatformSetting, ContactMessage])
