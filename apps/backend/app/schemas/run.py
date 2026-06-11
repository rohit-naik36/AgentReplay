from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Any, Dict
from datetime import datetime

from pydantic import Field
from typing import Literal

class ToolCallBase(BaseModel):
    tool_name: str = Field(..., max_length=255)
    input_json: Optional[Dict[str, Any]] = None
    output_json: Optional[Dict[str, Any]] = None
    status: Literal["success", "failed", "running", "replayed"]

class ToolCallCreate(ToolCallBase):
    pass

class ToolCallResponse(ToolCallBase):
    id: int
    run_id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class RunBase(BaseModel):
    session_id: Optional[str] = Field(None, max_length=255)
    parent_run_id: Optional[int] = None
    prompt: str
    response: Optional[str] = None
    model: Optional[str] = Field(None, max_length=255)
    latency_ms: Optional[int] = Field(None, ge=0)
    tokens_used: Optional[int] = Field(None, ge=0)
    status: Literal["success", "failed", "running", "replayed"]
    metadata_json: Optional[Dict[str, Any]] = None

    error_type: Optional[str] = Field(None, max_length=255)
    error_message: Optional[str] = None
    stack_trace: Optional[str] = None
    timeout_reason: Optional[str] = None
    malformed_output: Optional[str] = Field(None, max_length=255)
    token_limit_hit: Optional[str] = Field(None, max_length=255)

class RunCreate(RunBase):
    tool_calls: Optional[List[ToolCallCreate]] = None

class RunResponse(RunBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class RunDetailResponse(RunResponse):
    tool_calls: List[ToolCallResponse] = []

class PaginatedRunsResponse(BaseModel):
    items: List[RunResponse]
    total: int
    page: int
    size: int
    pages: int

class LineageResponse(BaseModel):
    original: RunDetailResponse
    chain: List[RunDetailResponse]
