from django.urls import path
from . import views

app_name = "dashboard"

urlpatterns = [
    # Auth
    path("login/",  views.LoginView.as_view(),  name="login"),
    path("logout/", views.LogoutView.as_view(), name="logout"),

    # Overview
    path("", views.OverviewView.as_view(), name="overview"),

    # Titles
    path("titles/",                views.TitleListView.as_view(),   name="titles"),
    path("titles/add/",            views.TitleAddView.as_view(),    name="title-add"),
    path("titles/<int:pk>/edit/",  views.TitleEditView.as_view(),   name="title-edit"),
    path("titles/<int:pk>/delete/",views.TitleDeleteView.as_view(), name="title-delete"),

    # Genres
    path("genres/",                views.GenreListView.as_view(),   name="genres"),
    path("genres/add/",            views.GenreAddView.as_view(),    name="genre-add"),
    path("genres/<int:pk>/edit/",  views.GenreEditView.as_view(),   name="genre-edit"),
    path("genres/<int:pk>/delete/",views.GenreDeleteView.as_view(), name="genre-delete"),

    # Reports
    path("reports/",                        views.ReportListView.as_view(),    name="reports"),
    path("reports/<int:pk>/resolve/",       views.ReportResolveView.as_view(), name="report-resolve"),
    path("reports/<int:pk>/dismiss/",       views.ReportDismissView.as_view(), name="report-dismiss"),

    # Super-admin only
    path("audit/",                          views.AuditLogView.as_view(),      name="audit"),
    path("users/",                          views.UserListView.as_view(),       name="users"),
    path("users/add/",                      views.UserAddView.as_view(),        name="user-add"),
    path("users/<int:pk>/suspend/",         views.UserSuspendView.as_view(),    name="user-suspend"),
    path("users/<int:pk>/activate/",        views.UserActivateView.as_view(),   name="user-activate"),
    path("users/<int:pk>/delete/",          views.UserDeleteView.as_view(),     name="user-delete"),
    path("settings/",                       views.SettingsView.as_view(),       name="settings"),
    path("settings/<int:pk>/delete/",       views.SettingDeleteView.as_view(),  name="setting-delete"),
]
