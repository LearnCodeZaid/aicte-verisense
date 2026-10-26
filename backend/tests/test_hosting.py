from pathlib import Path

from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.web import mount_frontend
from serve import restore_demo


def test_hosted_spa_deep_links_and_missing_api(tmp_path):
    (tmp_path / "index.html").write_text("<h1>VeriSense</h1>", encoding="utf-8")
    app = FastAPI()

    @app.get("/api/health")
    def health():
        return {"status": "ok"}

    mount_frontend(app, str(tmp_path))
    with TestClient(app) as client:
        assert client.get("/").status_code == 200
        assert "VeriSense" in client.get("/portal/applications/1").text
        assert client.get("/evaluation").status_code == 200
        assert client.get("/api/health").json() == {"status": "ok"}
        assert client.get("/api/not-a-route").status_code == 404
        assert client.get("/mock/not-a-route").status_code == 404
        assert client.get("/assets/missing.js").status_code == 404


def test_restart_does_not_overwrite_saved_database_or_uploads(tmp_path):
    snapshot = tmp_path / "snapshot"
    (snapshot / "storage").mkdir(parents=True)
    (snapshot / "storage/demo.pdf").write_bytes(b"sample")
    (snapshot / "verisense.db").write_bytes(b"initial")
    data = tmp_path / "data"
    restore_demo(snapshot, data)
    assert (data / "storage/demo.pdf").read_bytes() == b"sample"
    (data / "verisense.db").write_bytes(b"officer decisions")
    (data / "storage/new.pdf").write_bytes(b"upload")
    restore_demo(snapshot, data)
    assert (data / "verisense.db").read_bytes() == b"officer decisions"
    assert (data / "storage/new.pdf").read_bytes() == b"upload"
