import hmac
import secrets
from datetime import datetime, timedelta, timezone

import jwt
from fastapi import HTTPException, Request, Response, status
from passlib.context import CryptContext

from app.config import get_settings

settings = get_settings()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Verified against when the username is wrong, so a failed login takes the same time either way.
_DUMMY_HASH = pwd_context.hash(secrets.token_urlsafe(16))

# `__Host-` pins the cookie to this exact origin (Secure, Path=/, no Domain). Browsers reject it over
# plain http, so local development falls back to an unprefixed name.
COOKIE_NAME = "__Host-session" if settings.is_production else "session"


def verify_password(plain_password: str, password_hash: str) -> bool:
    try:
        return pwd_context.verify(plain_password, password_hash or _DUMMY_HASH) and bool(password_hash)
    except ValueError:
        return False


def verify_credentials(username: str, password: str) -> bool:
    username_ok = hmac.compare_digest(username.encode(), settings.admin_username.encode())
    # Always run the hash check so timing does not reveal whether the username exists.
    password_ok = verify_password(password, settings.admin_password_hash if username_ok else _DUMMY_HASH)
    return username_ok and password_ok


def create_access_token(subject: str) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": subject,
        "iat": now,
        "nbf": now,
        "exp": now + timedelta(minutes=settings.jwt_expire_minutes),
        "iss": settings.jwt_issuer,
        "aud": settings.jwt_audience,
        "jti": secrets.token_urlsafe(16),
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def set_session_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        COOKIE_NAME,
        token,
        max_age=settings.jwt_expire_minutes * 60,
        httponly=True,
        secure=settings.is_production,
        samesite="strict",
        path="/",
    )


def clear_session_cookie(response: Response) -> None:
    response.delete_cookie(COOKIE_NAME, path="/", httponly=True, secure=settings.is_production, samesite="strict")


def get_current_admin(request: Request) -> str:
    unauthorized = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not signed in")
    token = request.cookies.get(COOKIE_NAME)
    if not token:
        raise unauthorized
    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret,
            algorithms=[settings.jwt_algorithm],  # pinned: never trust the token's own `alg`
            audience=settings.jwt_audience,
            issuer=settings.jwt_issuer,
            options={"require": ["exp", "iat", "nbf", "sub", "iss", "aud"]},
        )
    except jwt.PyJWTError:
        raise unauthorized
    username = str(payload.get("sub", ""))
    if not hmac.compare_digest(username.encode(), settings.admin_username.encode()):
        raise unauthorized
    return username
