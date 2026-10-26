from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..db import get_db
from ..models import Institution, User
from ..schemas import institution_out
from ..security import ADMIN, INSTITUTION, get_current_user

router = APIRouter(prefix="/institutions", tags=["institutions"])


def _check(user: User, inst: Institution | None) -> Institution:
    if inst is None:
        raise HTTPException(404, "Institution not found")
    if user.role == INSTITUTION and user.institution_id != inst.id:
        raise HTTPException(404, "Institution not found")
    if user.role not in (INSTITUTION, ADMIN) and user.region and inst.region != user.region:
        raise HTTPException(404, "Institution not found")
    return inst


@router.get("")
def list_institutions(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    stmt = select(Institution)
    if user.role == INSTITUTION:
        stmt = stmt.where(Institution.id == (user.institution_id or -1))
    elif user.role != ADMIN and user.region:
        stmt = stmt.where(Institution.region == user.region)
    return [institution_out(i) for i in db.execute(stmt.order_by(Institution.name)).scalars()]


@router.get("/{inst_id}")
def get_institution(inst_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return institution_out(_check(user, db.get(Institution, inst_id)))


@router.get("/{inst_id}/records")
def records(inst_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return _check(user, db.get(Institution, inst_id)).records or {}
