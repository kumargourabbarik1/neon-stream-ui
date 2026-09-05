# Movizo Django API

This directory is the backend for the React application in `../Frontend`. It is a Django REST Framework API with JWT authentication, role-based administration, catalogue management, personal watch lists/progress, reporting, audit logs, and dashboard endpoints.

## Run locally

Install Python 3.11+ first, then from this directory:

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
python manage.py migrate
python manage.py seed_movizo
python manage.py runserver
```

The API will be at `http://127.0.0.1:8000/api/v1/`. The seed command is safe to run repeatedly. It creates the catalogue used by the current frontend plus these local accounts:

| Role | Email | Password |
| --- | --- | --- |
| Super admin | `rin@movizo.tv` | `MovizoDemo123!` |
| Admin | `daniel@movizo.tv` | `MovizoDemo123!` |
| Viewer | `viewer@movizo.tv` | `MovizoDemo123!` |

Change or remove those accounts before deploying.

## API overview

All routes are prefixed with `/api/v1/`.

| Area | Routes |
| --- | --- |
| Auth | `auth/register/`, `auth/token/`, `auth/token/refresh/`, `auth/password-reset/` |
| Catalogue | `titles/`, `titles/{slug}/`, `titles/{slug}/episodes/`, `titles/trending/`, `titles/new-releases/`, `titles/top-rated/` |
| Genres | `genres/`, `genres/{slug}/` |
| Account | `me/`, `me/profile/` |
| Personal library | `library/list/`, `library/list/{slug}/`, `library/progress/` |
| Moderation | `reports/` (authenticated users can create; staff can review) |
| Administration | `admin/content/`, `admin/users/`, `admin/reports/`, `admin/audit-logs/`, `admin/dashboard/` |
| Super admin | `admin/settings/`, `admin/system-health/` |

Use `Authorization: Bearer <access-token>` for protected endpoints. Title filters include `kind`, `genre`, `search`, `ordering` (`newest`, `rating`, or `views`), and `page`.

## Role rules

- `viewer` and `moderator`: browse and manage only their own library/profile.
- `admin`: content, genre, user-status, and report moderation access.
- `superadmin`: all admin access, admin-role changes/deletes, platform settings, system health, and global audit history.

## Connect the frontend

The existing frontend deliberately still uses mock data. When it is ready to be connected, set its API base URL to `http://127.0.0.1:8000/api/v1` and replace the mock-data reads with the catalogue endpoints. CORS is preconfigured for Vite's usual port 5173.

## Checks

```powershell
python manage.py check
python manage.py test
```
