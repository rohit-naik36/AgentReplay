from fastapi import Security, HTTPException, status
from fastapi.security import APIKeyHeader
import os

api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)

def verify_api_key(api_key_header: str = Security(api_key_header)):
    expected_api_key = os.getenv("AGENTREPLAY_API_KEY")

    # If the backend is running without an API key configured, we allow it (local dev mode fallback)
    # But per requirements: "Protect POST /api/runs, 401 for missing key, 401 for invalid key"
    # So we strictly enforce it if we assume it's set.
    # To be safe and deterministic, let's enforce it.

    if not expected_api_key:
        # Default fallback for local testing if env var isn't explicitly set yet
        expected_api_key = "sk-local-dev-key"

    if not api_key_header:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing API Key in X-API-Key header",
        )

    if api_key_header != expected_api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API Key",
        )
    return api_key_header
