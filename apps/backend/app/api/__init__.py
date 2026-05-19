from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc, func
from typing import Optional

from app.core.database import get_db
from app.models.run import Run, ToolCall
from app.schemas.run import RunCreate, RunResponse, RunDetailResponse, PaginatedRunsResponse

router = APIRouter()

@router.post("/runs", response_model=RunDetailResponse)
def create_run(run: RunCreate, db: Session = Depends(get_db)):
    db_run = Run(
        session_id=run.session_id,
        parent_run_id=run.parent_run_id,
        prompt=run.prompt,
        response=run.response,
        model=run.model,
        latency_ms=run.latency_ms,
        tokens_used=run.tokens_used,
        status=run.status,
        metadata_json=run.metadata_json
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
        if search.isdigit():
            query = query.filter(or_(Run.id == int(search), Run.prompt.ilike(f"%{search}%")))
        else:
            query = query.filter(Run.prompt.ilike(f"%{search}%"))

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

    # Create mock replayed run
    new_response = None
    if original_run.response:
        new_response = f"[MOCK REPLAY] {original_run.response}"

    replayed_run = Run(
        session_id=original_run.session_id,
        parent_run_id=original_run.id, # Link back
        prompt=original_run.prompt,
        response=new_response,
        model=original_run.model,
        latency_ms=original_run.latency_ms,
        tokens_used=original_run.tokens_used,
        status="replayed", # Set status to replayed
        metadata_json=original_run.metadata_json
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
