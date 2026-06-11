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


def test_valid_payload():
    payload = {"prompt": "Valid test", "status": "success", "latency_ms": 1500, "tokens_used": 50, "model": "gpt-4"}
    response = client.post("/api/runs", json=payload, )
    assert response.status_code == 200

def test_missing_required_fields():
    payload = {"status": "success"} # Missing prompt
    response = client.post("/api/runs", json=payload, )
    assert response.status_code == 422
    assert response.json()["detail"][0]["loc"] == ["body", "prompt"]
    assert response.json()["detail"][0]["type"] == "missing"

def test_invalid_status_enum():
    payload = {"prompt": "Enum test", "status": "undefined_status"}
    response = client.post("/api/runs", json=payload, )
    assert response.status_code == 422
    assert response.json()["detail"][0]["loc"] == ["body", "status"]
    assert response.json()["detail"][0]["type"] == "literal_error"

def test_negative_latency_rejected():
    payload = {"prompt": "Negative latency", "status": "failed", "latency_ms": -50}
    response = client.post("/api/runs", json=payload, )
    assert response.status_code == 422
    assert response.json()["detail"][0]["loc"] == ["body", "latency_ms"]
    assert response.json()["detail"][0]["type"] == "greater_than_equal"

def test_negative_tokens_rejected():
    payload = {"prompt": "Negative tokens", "status": "success", "tokens_used": -1}
    response = client.post("/api/runs", json=payload, )
    assert response.status_code == 422
    assert response.json()["detail"][0]["loc"] == ["body", "tokens_used"]
    assert response.json()["detail"][0]["type"] == "greater_than_equal"

def test_long_string_rejected():
    long_string = "a" * 256
    payload = {"prompt": "Long string", "status": "success", "session_id": long_string}
    response = client.post("/api/runs", json=payload, )
    assert response.status_code == 422
    assert response.json()["detail"][0]["loc"] == ["body", "session_id"]
    assert response.json()["detail"][0]["type"] == "string_too_long"
