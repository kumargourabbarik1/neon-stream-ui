from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Episode, Genre, Title, User


class ApiSmokeTests(APITestCase):
    def setUp(self):
        self.genre = Genre.objects.create(name="Action")
        self.title = Title.objects.create(name="Test Feature", kind="movie", year=2026, rating=8.5)
        self.title.genres.add(self.genre)
        self.user = User.objects.create_user(username="viewer@example.com", email="viewer@example.com", password="StrongPass123!")

    def test_public_catalogue_is_available(self):
        response = self.client.get(reverse("title-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["results"][0]["id"], "test-feature")

    def test_registration_and_token_login(self):
        registration = self.client.post(reverse("register"), {"email": "new@example.com", "password": "StrongPass123!", "name": "New User"})
        self.assertEqual(registration.status_code, status.HTTP_201_CREATED)
        login = self.client.post(reverse("token_obtain_pair"), {"email": "new@example.com", "password": "StrongPass123!"})
        self.assertEqual(login.status_code, status.HTTP_200_OK)
        self.assertIn("access", login.data)

    def test_authenticated_user_can_save_a_title(self):
        self.client.force_authenticate(self.user)
        response = self.client.post(reverse("library_item", kwargs={"slug": self.title.slug}))
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_email_login_works_when_username_differs(self):
        user = User.objects.create_user(username="legacy-user", email="legacy@example.com", password="StrongPass123!")
        response = self.client.post(reverse("token_obtain_pair"), {"email": user.email, "password": "StrongPass123!"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)

    def test_registration_normalizes_email_before_uniqueness_check(self):
        response = self.client.post(reverse("register"), {"email": " VIEWER@EXAMPLE.COM ", "password": "StrongPass123!"})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_episode_creation_accepts_parent_title_slug(self):
        self.user.role = User.Role.ADMIN
        self.user.save()
        self.client.force_authenticate(self.user)
        response = self.client.post(reverse("episode-list"), {
            "parent_title": self.title.slug,
            "title": "Pilot",
            "number": 1,
            "duration_seconds": 1200,
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Episode.objects.get(pk=response.data["id"]).title, self.title)
