from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from .. import audit
from ..db import get_db
from ..models import User
from ..schemas import LoginRequest, user_out
from ..security import create_token, get_current_user, verify_password

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login")
def login(body: LoginRequest, db: Session = Depends(get_db)):
    user = db.execute(select(User).where(User.username == body.username.strip())).scalar_one_or_none()
    if user is None or not user.active or not verify_password(body.password, user.password_hash):
        audit.record(db, body.username[:64] or "anonymous", "LOGIN_FAILED", "User", body.username[:64], {}, actor_role="ANONYMOUS")
        raise HTTPException(401, "Invalid username or password")
    audit.record(db, user, "LOGIN", "User", user.id, {})
    return {"accessToken": create_token(user), "tokenType": "bearer", "user": user_out(user)}


@router.get("/me")
def me(user: User = Depends(get_current_user)):
    return user_out(user)
