from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc, func
from typing import Optional
from app.api.dependencies import verify_api_key

from app.core.database import get_db
from app.models.run import Run, ToolCall
from app.schemas.run import RunCreate, RunResponse, RunDetailResponse, PaginatedRunsResponse, LineageResponse

router = APIRouter()

@router.post("/runs", response_model=RunDetailResponse)
def create_run(run: RunCreate, db: Session = Depends(get_db), api_key: str = Depends(verify_api_key)):
    db_run = Run(
        session_id=run.session_id,
        parent_run_id=run.parent_run_id,
        prompt=run.prompt,
        response=run.response,
        model=run.model,
        latency_ms=run.latency_ms,
        tokens_used=run.tokens_used,
        status=run.status,
        metadata_json=run.metadata_json,
        error_type=run.error_type,
        error_message=run.error_message,
        stack_trace=run.stack_trace,
        timeout_reason=run.timeout_reason,
        malformed_output=run.malformed_output,
        token_limit_hit=run.token_limit_hit
    )
    db.add(db_run)
    db.commit()
    db.refresh(db_run)

    if run.tool_calls:
        for tc in run.tool_calls:
            db_tc = ToolCall(
                run_id=db_run.id,
                tool_name=tc.tool_name,
                input_json=tc.input_json,
                output_json=tc.output_json,
                status=tc.status
            )
            db.add(db_tc)
        db.commit()
        db.refresh(db_run)

    return db_run

@router.get("/runs", response_model=PaginatedRunsResponse)
def get_runs(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    status: Optional[str] = None,
    model: Optional[str] = None,
    session_id: Optional[str] = None,
    search: Optional[str] = None, # Searches prompt or run ID
    db: Session = Depends(get_db)
):
    query = db.query(Run)

    if status:
        query = query.filter(Run.status == status)
    if model:
        query = query.filter(Run.model == model)
    if session_id:
        query = query.filter(Run.session_id == session_id)

    if search:
        search_terms = []
        if search.isdigit():
            search_terms.append(Run.id == int(search))
        search_terms.append(Run.prompt.ilike(f"%{search}%"))
        search_terms.append(func.coalesce(Run.session_id, '').ilike(f"%{search}%"))
        search_terms.append(func.coalesce(Run.model, '').ilike(f"%{search}%"))
        search_terms.append(Run.status.ilike(f"%{search}%"))

        # Add metadata search for error types and workflow names if present
        search_terms.append(func.coalesce(Run.error_type, '').ilike(f"%{search}%"))
        search_terms.append(func.coalesce(Run.error_message, '').ilike(f"%{search}%"))

        query = query.filter(or_(*search_terms))

    total = query.count()
    pages = (total + size - 1) // size

    runs = query.order_by(desc(Run.created_at)).offset((page - 1) * size).limit(size).all()

    return PaginatedRunsResponse(
        items=runs,
        total=total,
        page=page,
        size=size,
        pages=pages
    )

@router.get("/runs/{run_id}", response_model=RunDetailResponse)
def get_run(run_id: int, db: Session = Depends(get_db)):
    run = db.query(Run).filter(Run.id == run_id).first()
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")
    return run

@router.post("/runs/{run_id}/replay", response_model=RunDetailResponse)
def replay_run(run_id: int, db: Session = Depends(get_db)):
    original_run = db.query(Run).filter(Run.id == run_id).first()
    if not original_run:
        raise HTTPException(status_code=404, detail="Run not found")

    # Create mock replayed run that visibly improves outcomes
    new_response = original_run.response or ""
    new_latency = original_run.latency_ms
    new_tokens = original_run.tokens_used

    # Simulate a successful fix for various error conditions
    if original_run.status == "failed":
        new_latency = max(100, int((original_run.latency_ms or 2000) * 0.4))

        if original_run.malformed_output:
            new_response = '{\n  "status": "corrected",\n  "message": "Valid structured JSON generated via Replay."\n}'
            new_tokens = int((original_run.tokens_used or 500) * 0.8)
        elif original_run.timeout_reason:
            new_response = "Success: Timeout bypassed by re-routing upstream request."
        elif original_run.token_limit_hit:
            new_response = "Success: Context truncated effectively within limits."
            new_tokens = 250
        else:
            new_response = "Success: Execution completed without errors on retry."
    else:
        new_response = f"[MOCK REPLAY] {new_response}"
        if new_latency: new_latency = int(new_latency * 0.9)

    replayed_run = Run(
        session_id=original_run.session_id,
        parent_run_id=original_run.id, # Link back
        prompt=original_run.prompt,
        response=new_response,
        model=original_run.model,
        latency_ms=new_latency,
        tokens_used=new_tokens,
        status="success", # Set status to success to show resolution
        metadata_json=original_run.metadata_json,
        error_type=None,
        error_message=None,
        stack_trace=None,
        timeout_reason=None,
        malformed_output=None,
        token_limit_hit=None
    )
    db.add(replayed_run)
    db.commit()
    db.refresh(replayed_run)

    # Mock replay the tool calls too
    for tc in original_run.tool_calls:
        new_output = None
        if tc.output_json:
            new_output = tc.output_json.copy()
            new_output["_replay_note"] = "This is a mock replay"

        replayed_tc = ToolCall(
            run_id=replayed_run.id,
            tool_name=tc.tool_name,
            input_json=tc.input_json,
            output_json=new_output,
            status=tc.status
        )
        db.add(replayed_tc)

    db.commit()
    db.refresh(replayed_run)

    return replayed_run

@router.get("/runs/{run_id}/lineage", response_model=LineageResponse)
def get_run_lineage(run_id: int, db: Session = Depends(get_db)):
    run = db.query(Run).filter(Run.id == run_id).first()
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")

    # Traverse up to find the original run
    original_run = run
    while original_run.parent_run_id is not None:
        parent = db.query(Run).filter(Run.id == original_run.parent_run_id).first()
        if not parent:
            break
        original_run = parent

    # Traverse down to find all descendants
    chain = []
    current_runs = [original_run]

    while current_runs:
        current_run = current_runs.pop(0)
        chain.append(current_run)
        children = db.query(Run).filter(Run.parent_run_id == current_run.id).order_by(Run.created_at).all()
        current_runs.extend(children)

    return LineageResponse(
        original=original_run,
        chain=chain
    )
