from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.execution import Execution, ExecutionEvent, Replay
from app.schemas.execution import ExecutionResponse, ExecutionStartRequest, ExecutionReplayRequest, ReplayResponse

router = APIRouter(prefix="/executions", tags=["executions"])

@router.post("/start", response_model=ExecutionResponse)
def start_execution(req: ExecutionStartRequest, db: Session = Depends(get_db)):
    # Deterministic failure scenarios based on workflow name
    status = "failed"
    failure_reason = ""
    diagnostic_explanation = ""
    suggested_correction = {}
    events = []

    if req.workflow_name == "Procurement":
        events = [
            {"step": "Validate Request", "status": "completed"},
            {"step": "Check Inventory", "status": "completed"},
            {"step": "Generate PO", "status": "failed", "details": {"error": "Invalid vendor ID format"}}
        ]
        failure_reason = "PO Generation Failed"
        diagnostic_explanation = "The vendor ID provided in the payload does not match the expected format (VND-XXXX). The downstream API rejected it."
        suggested_correction = {"vendor_id": "VND-1234"}
    elif req.workflow_name == "Logistics":
        events = [
            {"step": "Route Planning", "status": "completed"},
            {"step": "Assign Driver", "status": "failed", "details": {"error": "No drivers available in region"}}
        ]
        failure_reason = "Driver Assignment Timeout"
        diagnostic_explanation = "The system attempted to find a driver in the requested region but none were available within the timeout period."
        suggested_correction = {"region_fallback": True, "timeout_ms": 30000}
    elif req.workflow_name == "Escalation":
        events = [
            {"step": "Analyze Sentiment", "status": "completed"},
            {"step": "Determine Priority", "status": "failed", "details": {"error": "Missing customer tier information"}}
        ]
        failure_reason = "Priority Determination Error"
        diagnostic_explanation = "The customer profile payload is missing the 'tier' attribute required for routing."
        suggested_correction = {"customer_tier": "standard"}
    else:
        # Default success fallback if not a known fail scenario
        status = "success"
        events = [{"step": "Process", "status": "completed"}]

    exec_record = Execution(
        workflow_name=req.workflow_name,
        input_payload=req.input_payload,
        status=status,
        failure_reason=failure_reason if status == "failed" else None,
        diagnostic_explanation=diagnostic_explanation if status == "failed" else None,
        suggested_correction=suggested_correction if status == "failed" else None
    )
    db.add(exec_record)
    db.commit()
    db.refresh(exec_record)

    for e in events:
        db_event = ExecutionEvent(
            execution_id=exec_record.id,
            step_name=e["step"],
            status=e["status"],
            details=e.get("details")
        )
        db.add(db_event)
    db.commit()
    db.refresh(exec_record)
    return exec_record

@router.get("/{exec_id}", response_model=ExecutionResponse)
def get_execution(exec_id: int, db: Session = Depends(get_db)):
    exec_record = db.query(Execution).filter(Execution.id == exec_id).first()
    if not exec_record:
        raise HTTPException(status_code=404, detail="Execution not found")
    return exec_record

@router.post("/{exec_id}/replay", response_model=ReplayResponse)
def replay_execution(exec_id: int, req: ExecutionReplayRequest, db: Session = Depends(get_db)):
    original = db.query(Execution).filter(Execution.id == exec_id).first()
    if not original:
        raise HTTPException(status_code=404, detail="Execution not found")

    replay_record = Replay(
        original_execution_id=original.id,
        correction_applied=req.correction,
        status="success"
    )
    db.add(replay_record)
    db.commit()
    db.refresh(replay_record)
    return replay_record
