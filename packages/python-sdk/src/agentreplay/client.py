import os
import httpx
from typing import Optional, List, Dict, Any
from .models import RunPayload, ToolCall

API_URL = os.environ.get("AGENTREPLAY_API_URL", "http://localhost:8000/api")

def track_run(
    prompt: str,
    status: str,
    response: Optional[str] = None,
    model: Optional[str] = None,
    latency_ms: Optional[int] = None,
    tokens_used: Optional[int] = None,
    session_id: Optional[str] = None,
    parent_run_id: Optional[int] = None,
    metadata: Optional[Dict[str, Any]] = None,
    tool_calls: Optional[List[Dict[str, Any]]] = None,
) -> Dict[str, Any]:
    """
    Synchronously tracks a run by sending it to the AgentReplay API.
    """

    parsed_tool_calls = None
    if tool_calls:
        parsed_tool_calls = [ToolCall(**tc) for tc in tool_calls]

    payload = RunPayload(
        prompt=prompt,
        response=response,
        model=model,
        latency_ms=latency_ms,
        tokens_used=tokens_used,
        status=status,
        session_id=session_id,
        parent_run_id=parent_run_id,
        metadata_json=metadata,
        tool_calls=parsed_tool_calls
    )

    with httpx.Client() as client:
        response = client.post(
            f"{API_URL}/runs",
            json=payload.model_dump(exclude_none=True)
        )
        response.raise_for_status()
        return response.json()


async def track_run_async(
    prompt: str,
    status: str,
    response: Optional[str] = None,
    model: Optional[str] = None,
    latency_ms: Optional[int] = None,
    tokens_used: Optional[int] = None,
    session_id: Optional[str] = None,
    parent_run_id: Optional[int] = None,
    metadata: Optional[Dict[str, Any]] = None,
    tool_calls: Optional[List[Dict[str, Any]]] = None,
) -> Dict[str, Any]:
    """
    Asynchronously tracks a run by sending it to the AgentReplay API.
    """

    parsed_tool_calls = None
    if tool_calls:
        parsed_tool_calls = [ToolCall(**tc) for tc in tool_calls]

    payload = RunPayload(
        prompt=prompt,
        response=response,
        model=model,
        latency_ms=latency_ms,
        tokens_used=tokens_used,
        status=status,
        session_id=session_id,
        parent_run_id=parent_run_id,
        metadata_json=metadata,
        tool_calls=parsed_tool_calls
    )

    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{API_URL}/runs",
            json=payload.model_dump(exclude_none=True)
        )
        response.raise_for_status()
        return response.json()
