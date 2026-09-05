from rest_framework.permissions import BasePermission


class IsAdminRole(BasePermission):
    message = "An administrator account is required."

    def has_permission(self, request, view):
        token = request.auth
        return bool(
            request.user
            and request.user.is_authenticated
            and getattr(request.user, "role", None) in {"admin", "superadmin"}
            and token is not None
            and token.get("mfa") is True
        )


class IsSuperAdminRole(BasePermission):
    message = "A super administrator account is required."

    def has_permission(self, request, view):
        token = request.auth
        return bool(
            request.user
            and request.user.is_authenticated
            and getattr(request.user, "role", None) == "superadmin"
            and token is not None
            and token.get("mfa") is True
        )
