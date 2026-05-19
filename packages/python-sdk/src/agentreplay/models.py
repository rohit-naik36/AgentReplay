from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class ToolCall(BaseModel):
    tool_name: str
    input_json: Optional[Dict[str, Any]] = None
    output_json: Optional[Dict[str, Any]] = None
    status: str

class RunPayload(BaseModel):
    session_id: Optional[str] = None
    parent_run_id: Optional[int] = None
    prompt: str
    response: Optional[str] = None
    model: Optional[str] = None
    latency_ms: Optional[int] = None
    tokens_used: Optional[int] = None
    status: str
    metadata_json: Optional[Dict[str, Any]] = None
    tool_calls: Optional[List[ToolCall]] = None
