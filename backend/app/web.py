"""Serve the built SPA beside the API when running as a single hosted service."""
from pathlib import Path

from fastapi import FastAPI
from starlette.exceptions import HTTPException
from starlette.staticfiles import StaticFiles


class SPAStaticFiles(StaticFiles):
    async def get_response(self, path, scope):
        path = path.replace("\\", "/")
        try:
            return await super().get_response(path, scope)
        except HTTPException as exc:
            # Missing APIs and assets must stay 404s, not receive index.html.
            if exc.status_code != 404 or path.split("/", 1)[0] in {"api", "mock", "assets"} or Path(path).suffix:
                raise
            return await super().get_response("index.html", scope)


def mount_frontend(app: FastAPI, directory: str):
    root = Path(directory)
    if not (root / "index.html").is_file():
        raise RuntimeError(f"Frontend build missing from {root}")
    app.mount("/", SPAStaticFiles(directory=root, html=True), name="frontend")
