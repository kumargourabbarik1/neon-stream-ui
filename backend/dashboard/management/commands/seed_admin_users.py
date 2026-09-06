"""
Management command to seed the initial admin and super-admin accounts.

Usage:
    python manage.py seed_admin_users
"""

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

User = get_user_model()

USERS = [
    {
        "email": "admin@admin.com",
        "password": "admin@admin",
        "display_name": "Admin",
        "role": "admin",
    },
    {
        "email": "superadmin@admin.com",
        "password": "admin@admin",
        "display_name": "Super Admin",
        "role": "superadmin",
    },
]


class Command(BaseCommand):
    help = "Create default admin and super-admin accounts for the dashboard."

    def handle(self, *args, **options):
        for data in USERS:
            email = data["email"]
            if User.objects.filter(email=email).exists():
                self.stdout.write(self.style.WARNING(f"  [skip]   {email} already exists."))
                continue

            user = User(
                email=email,
                username=email,
                display_name=data["display_name"],
                role=data["role"],
                is_active=True,
            )
            user.set_password(data["password"])
            user.save()
            self.stdout.write(self.style.SUCCESS(f"  [created] {email}  role={data['role']}"))

        self.stdout.write(self.style.SUCCESS("\nDone. Visit http://127.0.0.1:8000/dashboard/"))
