from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class ExecutionEventBase(BaseModel):
    step_name: str
    status: str
    details: Optional[Dict[str, Any]] = None

class ExecutionEventResponse(ExecutionEventBase):
    id: int
    execution_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class ReplayBase(BaseModel):
    correction_applied: Dict[str, Any]

class ReplayResponse(ReplayBase):
    id: int
    original_execution_id: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class ExecutionStartRequest(BaseModel):
    workflow_name: str
    input_payload: Dict[str, Any]

class ExecutionReplayRequest(BaseModel):
    correction: Dict[str, Any]

class ExecutionBase(BaseModel):
    workflow_name: str
    input_payload: Dict[str, Any]
    status: str
    failure_reason: Optional[str] = None
    diagnostic_explanation: Optional[str] = None
    suggested_correction: Optional[Dict[str, Any]] = None

class ExecutionResponse(ExecutionBase):
    id: int
    created_at: datetime
    events: List[ExecutionEventResponse] = []
    replays: List[ReplayResponse] = []

    class Config:
        from_attributes = True
