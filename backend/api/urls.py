from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    AdminUserViewSet,
    AdminLoginView,
    AdminTwoFactorConfirmView,
    AdminTwoFactorSetupView,
    AdminTwoFactorVerifyView,
    AuditLogViewSet,
    ContactMessageView,
    DashboardView,
    EpisodeViewSet,
    GenreViewSet,
    LibraryItemView,
    LibraryListView,
    PlatformSettingView,
    ProgressView,
    ReportViewSet,
    SystemHealthView,
    TitleViewSet,
)

router = DefaultRouter()
router.register("titles", TitleViewSet, basename="title")
router.register("genres", GenreViewSet, basename="genre")
router.register("episodes", EpisodeViewSet, basename="episode")
router.register("reports", ReportViewSet, basename="report")
router.register("admin/content", TitleViewSet, basename="admin-content")
router.register("admin/users", AdminUserViewSet, basename="admin-user")
router.register("admin/reports", ReportViewSet, basename="admin-report")
router.register("admin/audit-logs", AuditLogViewSet, basename="audit-log")

urlpatterns = [
    path("admin/auth/login/", AdminLoginView.as_view(), name="admin_login"),
    path("admin/auth/2fa/setup/", AdminTwoFactorSetupView.as_view(), name="admin_2fa_setup"),
    path("admin/auth/2fa/confirm/", AdminTwoFactorConfirmView.as_view(), name="admin_2fa_confirm"),
    path("admin/auth/2fa/verify/", AdminTwoFactorVerifyView.as_view(), name="admin_2fa_verify"),
    path("admin/auth/token/refresh/", TokenRefreshView.as_view(), name="admin_token_refresh"),
    path("contact/", ContactMessageView.as_view(), name="contact"),
    path("admin/dashboard/", DashboardView.as_view(), name="admin_dashboard"),
    path("admin/system-health/", SystemHealthView.as_view(), name="system_health"),
    path("admin/settings/", PlatformSettingView.as_view(), name="platform_settings"),
    path("", include(router.urls)),
]
