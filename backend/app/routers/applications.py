from __future__ import annotations

from datetime import datetime, timezone

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, Response, UploadFile
from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from .. import audit
from ..db import get_db
from ..engine.ingest import ingest_document
from ..engine.report_pdf import build_report_pdf
from ..engine.validator import run_validation
from ..models import Alert, Application, Finding, Institution, User, ValidationRun
from ..schemas import (
    DECISION_ACTIONS,
    RECOMMEND_ACTIONS,
    ApplicationCreate,
    ApplicationPatch,
    DecisionRequest,
    NoteRequest,
    RectificationRequest,
    application_detail_out,
    application_out,
    audit_out,
    document_out,
    finding_out,
)
from ..security import ADMIN, INSTITUTION, OFFICER, OFFICER_PLUS, RD, get_current_user, require_roles, scope_applications
from ._common import EDITABLE_BY_INSTITUTION, get_app

router = APIRouter(prefix="/applications", tags=["applications"])

CAT_CODE = {"EOA": "EOA", "NEW_INSTITUTION": "NEW", "INTAKE_INCREASE": "INC", "NEW_COURSE": "NCR",
            "CHANGE_OF_NAME": "CON", "CHANGE_OF_SITE": "COS", "CLOSURE": "CLS"}


def _now():
    return datetime.now(timezone.utc).replace(tzinfo=None)


def next_application_no(db: Session, category: str, academic_year: str, inst: Institution) -> str:
    n = (db.query(Application).count() or 0) + 1
    while True:
        no = f"VS/{academic_year}/{CAT_CODE.get(category, 'GEN')}/{inst.region}/{n:05d}"
        if not db.execute(select(Application.id).where(Application.application_no == no)).first():
            return no
        n += 1


def assign_officer(db: Session, region: str) -> str | None:
    u = db.execute(select(User).where(User.role == OFFICER, User.region == region).order_by(User.id)).scalars().first()
    return u.username if u else None


@router.get("")
def list_applications(
    status: str | None = None, category: str | None = None, region: str | None = None, q: str | None = None,
    riskBand: str | None = Query(None), db: Session = Depends(get_db), user: User = Depends(get_current_user),
):
    stmt = scope_applications(select(Application).join(Institution), user)
    if status:
        stmt = stmt.where(Application.status.in_(status.split(",")))
    if category:
        stmt = stmt.where(Application.category.in_(category.split(",")))
    if region:
        stmt = stmt.where(Application.region == region)
    if riskBand:
        stmt = stmt.where(Application.risk_band.in_(riskBand.split(",")))
    if q:
        like = f"%{q.strip()}%"
        stmt = stmt.where(or_(Application.application_no.ilike(like), Institution.name.ilike(like),
                              Institution.permanent_id.ilike(like), Institution.city.ilike(like)))
    apps = db.execute(stmt.order_by(Application.updated_at.desc())).unique().scalars().all()
    return [application_out(a) for a in apps]


@router.post("", status_code=201)
def create_application(body: ApplicationCreate, db: Session = Depends(get_db),
                       user: User = Depends(require_roles(INSTITUTION))):
    inst = db.get(Institution, user.institution_id) if user.institution_id else None
    if inst is None:
        raise HTTPException(400, "User is not linked to an institution")
    app = Application(application_no=next_application_no(db, body.category, body.academic_year, inst),
                      institution_id=inst.id, category=body.category, academic_year=body.academic_year,
                      status="DRAFT", region=inst.region, form_data=body.form_data)
    db.add(app)
    db.flush()
    from ..engine.validator import Ctx, build_checklist

    app.checklist = build_checklist(Ctx(db, app))
    audit.record(db, user, "APPLICATION_CREATED", "Application", app.id,
                 {"applicationNo": app.application_no, "category": app.category, "academicYear": app.academic_year})
    db.refresh(app)
    return application_out(app)


@router.get("/{app_id}")
def get_application(app_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return application_detail_out(get_app(db, app_id, user))


@router.patch("/{app_id}")
def patch_application(app_id: int, body: ApplicationPatch, db: Session = Depends(get_db),
                      user: User = Depends(require_roles(INSTITUTION))):
    app = get_app(db, app_id, user)
    if app.status not in ("DRAFT", "RECTIFICATION_REQUESTED"):
        raise HTTPException(409, f"Application cannot be edited in status {app.status}")
    before = app.form_data or {}
    merged = {**before, **body.form_data}
    changed = sorted(k for k in merged if before.get(k) != merged.get(k))
    app.form_data = merged
    audit.record(db, user, "APPLICATION_UPDATED", "Application", app.id,
                 {"changedFields": changed, "before": {k: before.get(k) for k in changed},
                  "after": {k: merged.get(k) for k in changed}})
    db.refresh(app)
    return application_out(app)


@router.post("/{app_id}/documents", status_code=201)
def upload_document(app_id: int, file: UploadFile = File(...), docType: str | None = Form(None),
                    db: Session = Depends(get_db), user: User = Depends(require_roles(INSTITUTION))):
    app = get_app(db, app_id, user)
    if app.status not in EDITABLE_BY_INSTITUTION:
        raise HTTPException(409, f"Documents cannot be uploaded in status {app.status}")
    data = file.file.read()
    if not data:
        raise HTTPException(400, "Empty file")
    if len(data) > 25 * 1024 * 1024:
        raise HTTPException(413, "File too large (max 25 MB)")
    try:
        doc = ingest_document(db, app, data, file.filename or "upload", docType or None, user, file.content_type)
    except ValueError as e:
        raise HTTPException(400, str(e))
    return document_out(doc)


def _can_validate(user: User, app: Application, update_status: bool):
    if user.role == INSTITUTION:
        if app.status != "DRAFT":
            raise HTTPException(403, "Institutions may only run a pre-check on DRAFT applications")
    elif user.role not in OFFICER_PLUS:
        raise HTTPException(403, "Not allowed")


@router.post("/{app_id}/submit")
def submit(app_id: int, db: Session = Depends(get_db), user: User = Depends(require_roles(INSTITUTION))):
    app = get_app(db, app_id, user)
    if app.status not in EDITABLE_BY_INSTITUTION:
        raise HTTPException(409, f"Application cannot be submitted in status {app.status}")
    prev = app.status
    app.status = "SUBMITTED"
    app.submitted_at = _now()
    if not app.assigned_officer:
        app.assigned_officer = assign_officer(db, app.region)
    audit.record(db, user, "APPLICATION_SUBMITTED", "Application", app.id,
                 {"applicationNo": app.application_no, "from": prev, "assignedOfficer": app.assigned_officer,
                  "documents": len(app.documents)})
    return run_validation(db, app.id, user)


@router.post("/{app_id}/validate")
def validate(app_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    app = get_app(db, app_id, user)
    _can_validate(user, app, True)
    return run_validation(db, app.id, user, update_status=user.role != INSTITUTION)


def _latest_report(db: Session, app: Application) -> dict:
    run = db.execute(select(ValidationRun).where(ValidationRun.application_id == app.id)
                     .order_by(ValidationRun.id.desc()).limit(1)).scalar_one_or_none()
    if run is None:
        raise HTTPException(404, "Application has not been validated yet")
    rep = dict(run.report)
    # findings / status reflect current officer actions; rule results are the snapshot of that run
    rep["findings"] = [finding_out(f) for f in app.findings]
    rep["status"] = app.status
    rep["decision"] = app.decision
    rep["recommendation"] = app.recommendation
    return rep


@router.get("/{app_id}/report")
def report(app_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return _latest_report(db, get_app(db, app_id, user))


@router.get("/{app_id}/report.pdf")
def report_pdf(app_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    app = get_app(db, app_id, user)
    rep = _latest_report(db, app)
    pdf = build_report_pdf(app, rep, generated_for=user)
    audit.record(db, user, "REPORT_EXPORTED", "Application", app.id, {"format": "pdf", "rulesetVersion": rep.get("rulesetVersion")})
    fname = app.application_no.replace("/", "_") + "_validation_report.pdf"
    return Response(pdf, media_type="application/pdf", headers={"Content-Disposition": f'inline; filename="{fname}"'})


@router.post("/{app_id}/observations")
def add_observation(app_id: int, body: NoteRequest, db: Session = Depends(get_db),
                    user: User = Depends(require_roles(*OFFICER_PLUS))):
    app = get_app(db, app_id, user)
    ev = audit.record(db, user, "OBSERVATION_ADDED", "Application", app.id, {"note": body.note.strip()})
    return audit_out(ev)


@router.post("/{app_id}/request-rectification")
def request_rectification(app_id: int, body: RectificationRequest, db: Session = Depends(get_db),
                          user: User = Depends(require_roles(*OFFICER_PLUS))):
    app = get_app(db, app_id, user)
    if app.status in ("DRAFT", "DECIDED"):
        raise HTTPException(409, f"Cannot request rectification in status {app.status}")
    ids = set(body.finding_ids)
    found = [f for f in app.findings if f.id in ids]
    if len(found) != len(ids):
        raise HTTPException(400, "Some findingIds do not belong to this application")
    for f in found:
        f.status = "ESCALATED"
        f.human_modified = True
        f.reviewer_note = f"Rectification requested: {body.note.strip()}"
    prev = app.status
    app.status = "RECTIFICATION_REQUESTED"
    db.add(Alert(application_id=app.id, type="RECTIFICATION_REQUESTED", severity="MAJOR",
                 message=f"{app.application_no}: rectification requested by {user.full_name} — {body.note.strip()[:160]}"))
    audit.record(db, user, "RECTIFICATION_REQUESTED", "Application", app.id,
                 {"note": body.note.strip(), "findingIds": sorted(ids), "from": prev})
    db.refresh(app)
    return application_out(app)


FINAL_STATUS = {"APPROVE_FOR_EOA": "DECIDED", "REJECT": "DECIDED", "ORDER_INSPECTION": "INSPECTION_ORDERED",
                "ISSUE_DEFICIENCY_LETTER": "RECTIFICATION_REQUESTED"}


@router.post("/{app_id}/decision")
def decision(app_id: int, body: DecisionRequest, db: Session = Depends(get_db),
             user: User = Depends(require_roles(OFFICER, RD))):
    app = get_app(db, app_id, user)
    action = (body.action or "").strip().upper()
    note = (body.note or "").strip()
    if len(note) < 5:
        raise HTTPException(422, "A justification note (at least 5 characters) is required for every decision/recommendation")
    if user.role == OFFICER and action not in RECOMMEND_ACTIONS:
        raise HTTPException(403, "Scrutiny officers may only record a recommendation (RECOMMEND_*); the Regional Director decides")
    if user.role == RD and action not in DECISION_ACTIONS:
        raise HTTPException(400, f"Unknown decision action. Allowed: {', '.join(DECISION_ACTIONS)}")
    if app.status in ("DRAFT",):
        raise HTTPException(409, "Application has not been submitted")
    if app.status == "DECIDED":
        raise HTTPException(409, "Application already decided")
    if app.last_validated_at is None:
        raise HTTPException(409, "Application must be validated before a decision or recommendation")
    base_action = action.removeprefix("RECOMMEND_")
    if base_action == "APPROVE_FOR_EOA":
        blocking = [f for f in app.findings if f.severity == "CRITICAL" and f.status == "OPEN"]
        if blocking:
            audit.record(db, user, "DECISION_BLOCKED", "Application", app.id,
                         {"action": action, "blockingFindingIds": [f.id for f in blocking]})
            raise HTTPException(409, (
                f"Cannot {'recommend approval' if user.role == OFFICER else 'approve'}: {len(blocking)} CRITICAL finding(s) "
                "are still OPEN without an officer disposition (acknowledge, dismiss with reason, rectified or escalate): "
                + "; ".join(f"#{f.id} {f.title}" for f in blocking[:6])))
    entry = {"action": action, "note": note, "decidedBy": user.username, "decidedByName": user.full_name,
             "role": user.role, "decidedAt": _now().isoformat() + "Z",
             "complianceScore": app.compliance_score, "riskScore": app.risk_score}
    prev = app.status
    if user.role == OFFICER:
        app.recommendation = entry
        app.status = "RECOMMENDED"
        evt = "RECOMMENDATION_RECORDED"
    else:
        app.decision = entry
        app.status = FINAL_STATUS[action]
        evt = "DECISION_RECORDED"
    db.add(Alert(application_id=app.id, type=evt, severity="INFO",
                 message=f"{app.application_no}: {action.replace('_', ' ').title()} by {user.full_name}"))
    audit.record(db, user, evt, "Application", app.id, {**entry, "from": prev, "to": app.status})
    db.refresh(app)
    return application_out(app)
