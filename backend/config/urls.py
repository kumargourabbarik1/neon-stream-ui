from django.urls import include, path


urlpatterns = [
    # Django's session-only admin is intentionally disabled. Privileged access
    # goes through the React admin app and its mandatory TOTP API flow instead.
    path("api/v1/", include("api.urls")),
]
