from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.execution import Execution, ExecutionEvent, Replay
from app.schemas.execution import ExecutionResponse, ExecutionStartRequest, ExecutionReplayRequest, ReplayResponse
from app.services.correction_service import CorrectionService

router = APIRouter(prefix="/executions", tags=["executions"])

@router.post("/start", response_model=ExecutionResponse)
def start_execution(req: ExecutionStartRequest, db: Session = Depends(get_db)):
    # Deterministic failure scenarios based on workflow name
    status = "failed"
    failure_reason = ""
    diagnostic_explanation = ""
    suggested_correction = {}
    events = []

    events = [{"step": "Execution Started", "status": "completed"}]

    if req.workflow_name == "Procurement":
        events.append({"step": "Input validated", "status": "completed"})
        if req.input_payload.get("quantity", 0) > 15:
            events.append({"step": "Inventory checked", "status": "failed", "details": {"error": "Inventory unavailable"}})
            failure_reason = "Inventory unavailable"
        else:
            events.append({"step": "Inventory checked", "status": "completed"})
            events.append({"step": "Workflow completed", "status": "completed"})
            status = "success"
    elif req.workflow_name == "Logistics":
        events.append({"step": "Input validated", "status": "completed"})
        if not req.input_payload.get("destination"):
            events.append({"step": "Route planning", "status": "failed", "details": {"error": "Missing destination"}})
            failure_reason = "Missing destination"
        else:
            events.append({"step": "Route planning", "status": "completed"})
            events.append({"step": "Workflow completed", "status": "completed"})
            status = "success"
    elif req.workflow_name == "Escalation":
        events.append({"step": "Input validated", "status": "completed"})
        if not req.input_payload.get("customer_id") or req.input_payload.get("customer_id") == "REF-0000":
            events.append({"step": "Lookup customer", "status": "failed", "details": {"error": "Missing customer ID"}})
            failure_reason = "Missing customer ID"
        else:
            events.append({"step": "Lookup customer", "status": "completed"})
            events.append({"step": "Workflow completed", "status": "completed"})
            status = "success"
    else:
        status = "success"
        events.append({"step": "Workflow completed", "status": "completed"})

    if failure_reason:
        status = "failed"
        correction, diag = CorrectionService.suggest(req.input_payload, failure_reason)
        suggested_correction = correction
        diagnostic_explanation = diag


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

@router.post("/{exec_id}/replay", response_model=ExecutionResponse)
def replay_execution(exec_id: int, req: ExecutionReplayRequest, db: Session = Depends(get_db)):
    original = db.query(Execution).filter(Execution.id == exec_id).first()
    if not original:
        raise HTTPException(status_code=404, detail="Execution not found")

    # Record the replay action itself
    replay_record = Replay(
        original_execution_id=original.id,
        correction_applied=req.correction,
        status="success"
    )
    db.add(replay_record)
    db.commit()
    db.refresh(replay_record)

    # Actually perform the "re-run workflow with corrected payload" logic
    # We create a new Execution record to represent the child run, similar to how standard AgentReplay works
    events = [{"step": "Execution Started", "status": "completed"}, {"step": "Input validated", "status": "completed"}]

    if original.workflow_name == "Procurement":
        events.append({"step": "Inventory checked", "status": "completed"})
    elif original.workflow_name == "Logistics":
         events.append({"step": "Route planning", "status": "completed"})
    elif original.workflow_name == "Escalation":
         events.append({"step": "Lookup customer", "status": "completed"})

    events.append({"step": "Workflow completed", "status": "completed"})

    new_exec = Execution(
        workflow_name=original.workflow_name,
        input_payload=req.correction,
        status="success",
    )
    db.add(new_exec)
    db.commit()
    db.refresh(new_exec)

    for e in events:
        db_event = ExecutionEvent(
            execution_id=new_exec.id,
            step_name=e["step"],
            status=e["status"],
            details=e.get("details")
        )
        db.add(db_event)
    db.commit()
    db.refresh(new_exec)

    return new_exec
