"""AICTE VeriSense API — FastAPI app, CORS, routers, startup seeding."""
from __future__ import annotations

import importlib
import logging
from contextlib import asynccontextmanager

from fastapi import APIRouter, FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .config import VERSION, get_settings
from .db import init_db
from .routers import (
    alerts,
    applications,
    audit_log,
    auth,
    dashboard,
    documents,
    findings,
    institutions,
    meta,
    rules,
    sources,
)

log = logging.getLogger("verisense")
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")


@asynccontextmanager
async def lifespan(_app: FastAPI):
    init_db()
    s = get_settings()
    if s.autoseed:
        try:
            from seed.seed import seed_if_empty

            seed_if_empty()
        except Exception:  # noqa: BLE001 - never block startup on demo data
            log.exception("auto-seed failed")
    yield


app = FastAPI(
    title="AICTE VeriSense API",
    version=VERSION,
    description="AI-assisted application validation, document authentication and compliance verification "
                "(SIH 2026 prototype, PS 26261). All outputs are advisory decision support.",
    lifespan=lifespan,
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in get_settings().cors_origins.split(",") if o.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"],
)


@app.exception_handler(Exception)
async def unhandled(_req: Request, exc: Exception):  # pragma: no cover - safety net
    log.exception("unhandled error: %s", exc)
    return JSONResponse(status_code=500, content={"detail": f"Internal error: {type(exc).__name__}"})


api = APIRouter(prefix="/api")


@api.get("/health", tags=["meta"])
def health():
    from .engine.pipeline_bridge import available

    return {"status": "ok", "version": VERSION, "pipeline": available()}


for r in (auth, meta, dashboard, applications, documents, findings, alerts, audit_log, rules, sources, institutions):
    api.include_router(r.router)
app.include_router(api)

# simulated issuing-authority services (AI module); optional until it lands
try:
    _mock = importlib.import_module("app.mock_authorities")
    app.include_router(getattr(_mock, "router"), prefix="/mock")
except Exception as _e:  # noqa: BLE001
    log.info("mock authorities not mounted: %s", _e)
