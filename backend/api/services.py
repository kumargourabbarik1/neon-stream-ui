import base64
import binascii
import secrets
import time
from urllib.parse import quote

import qrcode
from cryptography.fernet import Fernet, InvalidToken
from django.conf import settings
from django.contrib.auth.hashers import check_password, make_password
from django.core import signing
from django.utils import timezone
from django_otp.oath import TOTP
from qrcode.image.svg import SvgPathImage
from rest_framework_simplejwt.tokens import RefreshToken

from .models import AdminTwoFactor, AuditLog, BackupCode


def client_ip(request):
    forwarded = request.META.get("HTTP_X_FORWARDED_FOR")
    return forwarded.split(",")[0].strip() if forwarded else request.META.get("REMOTE_ADDR")


def audit(request, action, target, metadata=None, actor=None):
    AuditLog.objects.create(
        actor=actor if actor is not None else (request.user if request.user.is_authenticated else None),
        action=action,
        target=str(target),
        ip_address=client_ip(request),
        metadata=metadata or {},
    )


# ---- Privileged TOTP authentication -------------------------------------------------

def _fernet():
    return Fernet(settings.TOTP_ENCRYPTION_KEY.encode())


def _new_totp_secret():
    return base64.b32encode(secrets.token_bytes(20)).decode("ascii").rstrip("=")


def _encrypt(secret):
    return _fernet().encrypt(secret.encode("ascii")).decode("ascii")


def _decrypt(device):
    try:
        return _fernet().decrypt(device.encrypted_secret.encode("ascii")).decode("ascii")
    except (InvalidToken, UnicodeDecodeError) as exc:
        raise ValueError("The two-factor secret could not be decrypted.") from exc


def _totp_uri(user, secret):
    label = quote(f"MOVIZO:{user.email}")
    return f"otpauth://totp/{label}?secret={secret}&issuer=MOVIZO&algorithm=SHA1&digits=6&period=30"


def _qr_data_uri(uri):
    svg = qrcode.make(uri, image_factory=SvgPathImage).to_string(encoding="unicode")
    encoded = base64.b64encode(svg.encode("utf-8")).decode("ascii")
    return f"data:image/svg+xml;base64,{encoded}"


def create_enrollment_device(user):
    """Replace an unconfirmed device with a fresh secret for a new enrollment."""
    secret = _new_totp_secret()
    device, _ = AdminTwoFactor.objects.update_or_create(
        user=user,
        defaults={
            "encrypted_secret": _encrypt(secret),
            "drift": 0,
            "last_verified_step": None,
            "is_confirmed": False,
            "confirmed_at": None,
        },
    )
    return device, secret, _qr_data_uri(_totp_uri(user, secret))


def normalize_verification_code(value):
    return "".join(str(value or "").upper().split()).replace("-", "")


def verify_totp(device, submitted_code):
    code = normalize_verification_code(submitted_code)
    if len(code) != 6 or not code.isdigit():
        return False
    try:
        secret = _decrypt(device)
        key = base64.b32decode(secret + "=" * (-len(secret) % 8), casefold=True)
    except (ValueError, binascii.Error):
        return False

    totp = TOTP(key, drift=device.drift)
    totp.time = time.time()
    minimum_step = device.last_verified_step + 1 if device.last_verified_step is not None else None
    if not totp.verify(int(code), tolerance=1, min_t=minimum_step):
        return False

    device.drift = totp.drift
    device.last_verified_step = totp.t()
    device.save(update_fields=["drift", "last_verified_step", "updated_at"])
    return True


def generate_backup_codes(user, count=10):
    BackupCode.objects.filter(user=user).delete()
    codes = []
    for _ in range(count):
        raw = secrets.token_hex(4).upper()
        display = f"{raw[:4]}-{raw[4:]}"
        BackupCode.objects.create(user=user, code_hash=make_password(raw))
        codes.append(display)
    return codes


def consume_backup_code(user, submitted_code):
    normalized = normalize_verification_code(submitted_code)
    if len(normalized) != 8 or not normalized.isalnum():
        return False
    for backup_code in BackupCode.objects.filter(user=user, used_at__isnull=True).order_by("id"):
        if check_password(normalized, backup_code.code_hash):
            backup_code.used_at = timezone.now()
            backup_code.save(update_fields=["used_at"])
            return True
    return False


def make_two_factor_challenge(user, purpose):
    return signing.dumps({"user_id": user.pk}, salt=f"movizo.2fa.{purpose}").replace("=", "")


def resolve_two_factor_challenge(token, purpose, user_model):
    try:
        payload = signing.loads(token, salt=f"movizo.2fa.{purpose}", max_age=300)
    except signing.BadSignature as exc:
        raise ValueError("This two-factor challenge has expired. Sign in again.") from exc
    return user_model.objects.filter(pk=payload.get("user_id"), is_active=True).first()


def issue_privileged_tokens(user):
    refresh = RefreshToken.for_user(user)
    refresh["role"] = user.role
    refresh["mfa"] = True
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }
