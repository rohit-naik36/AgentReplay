import os
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.core.database import Base, get_db

# Setup test DB
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_env():
    os.environ["AGENTREPLAY_API_KEY"] = "sk-test-key-123"
    yield
    del os.environ["AGENTREPLAY_API_KEY"]

def test_runs_missing_api_key():
    payload = {"prompt": "Hello", "status": "success"}
    response = client.post("/api/runs", json=payload)
    assert response.status_code == 401
    assert response.json()["detail"] == "Missing API Key in X-API-Key header"

def test_runs_invalid_api_key():
    payload = {"prompt": "Hello", "status": "success"}
    response = client.post("/api/runs", json=payload, headers={"X-API-Key": "invalid-key"})
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid API Key"

def test_runs_valid_api_key():
    payload = {"prompt": "Hello", "status": "success"}
    response = client.post("/api/runs", json=payload, headers={"X-API-Key": "sk-test-key-123"})
    assert response.status_code == 201
    data = response.json()
    assert data["prompt"] == "Hello"

def test_unprotected_routes():
    response = client.get("/api/runs")
    assert response.status_code == 200

def test_missing_env_var_raises_error(monkeypatch):
    monkeypatch.delenv("AGENTREPLAY_API_KEY", raising=False)
    payload = {"prompt": "Hello", "status": "success"}

    with pytest.raises(RuntimeError) as exc_info:
        client.post("/api/runs", json=payload, headers={"X-API-Key": "sk-test-key-123"})

    assert "AGENTREPLAY_API_KEY environment variable is not configured" in str(exc_info.value)
