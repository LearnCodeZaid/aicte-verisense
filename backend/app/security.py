"""JWT (HS256, 8h), bcrypt password hashing, role guards."""
from __future__ import annotations

from datetime import datetime, timedelta, timezone

import bcrypt
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from .config import get_settings
from .db import get_db
from .models import Application, User

ALGORITHM = "HS256"

INSTITUTION = "INSTITUTION"
OFFICER = "SCRUTINY_OFFICER"
RD = "REGIONAL_DIRECTOR"
ADMIN = "ADMIN"
OFFICER_PLUS = (OFFICER, RD, ADMIN)

_bearer = HTTPBearer(auto_error=False)


def hash_password(pw: str) -> str:
    return bcrypt.hashpw(pw.encode(), bcrypt.gensalt(rounds=10)).decode()


def verify_password(pw: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(pw.encode(), hashed.encode())
    except ValueError:
        return False


def create_token(user: User) -> str:
    s = get_settings()
    now = datetime.now(timezone.utc)
    payload = {
        "sub": str(user.id),
        "username": user.username,
        "role": user.role,
        "iat": int(now.timestamp()),
        "exp": int((now + timedelta(hours=s.jwt_expiry_hours)).timestamp()),
    }
    return jwt.encode(payload, s.secret, algorithm=ALGORITHM)


def decode_token(token: str) -> dict:
    return jwt.decode(token, get_settings().secret, algorithms=[ALGORITHM])


def get_current_user(
    creds: HTTPAuthorizationCredentials | None = Depends(_bearer),
    db: Session = Depends(get_db),
) -> User:
    if creds is None or not creds.credentials:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Not authenticated",
                            headers={"WWW-Authenticate": "Bearer"})
    try:
        payload = decode_token(creds.credentials)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Token expired")
    except jwt.PyJWTError:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid token")
    user = db.get(User, int(payload.get("sub", 0)))
    if user is None or not user.active:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "User not found")
    return user


def require_roles(*roles: str):
    def dep(user: User = Depends(get_current_user)) -> User:
        if user.role not in roles:
            raise HTTPException(status.HTTP_403_FORBIDDEN, f"Requires role: {', '.join(roles)}")
        return user

    return dep


require_officer_plus = require_roles(*OFFICER_PLUS)
require_admin = require_roles(ADMIN)
require_institution = require_roles(INSTITUTION)


def can_access_application(user: User, app: Application) -> bool:
    if user.role == ADMIN:
        return True
    if user.role == INSTITUTION:
        return user.institution_id is not None and app.institution_id == user.institution_id
    if user.role in (OFFICER, RD):
        return user.region is None or app.region == user.region
    return False


def ensure_app_access(user: User, app: Application | None) -> Application:
    if app is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Application not found")
    if not can_access_application(user, app):
        # do not leak existence across tenants
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Application not found")
    return app


def scope_applications(query, user: User):
    """Apply RBAC scoping to a select(Application) statement."""
    if user.role == INSTITUTION:
        return query.where(Application.institution_id == (user.institution_id or -1))
    if user.role in (OFFICER, RD) and user.region:
        return query.where(Application.region == user.region)
    return query
