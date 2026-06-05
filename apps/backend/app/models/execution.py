from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class Execution(Base):
    __tablename__ = "executions"

    id = Column(Integer, primary_key=True, index=True)

    workflow_name = Column(String, index=True)
    input_payload = Column(JSON)

    status = Column(String)  # running, failed, success

    failure_reason = Column(String, nullable=True)
    diagnostic_explanation = Column(String, nullable=True)
    suggested_correction = Column(JSON, nullable=True)

    parent_execution_id = Column(
        Integer,
        ForeignKey("executions.id"),
        nullable=True,
        index=True,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    events = relationship(
        "ExecutionEvent",
        back_populates="execution",
        cascade="all, delete-orphan",
    )

    replays = relationship(
        "Replay",
        back_populates="original_execution",
        cascade="all, delete-orphan",
    )


class ExecutionEvent(Base):
    __tablename__ = "execution_events"

    id = Column(Integer, primary_key=True, index=True)

    execution_id = Column(
        Integer,
        ForeignKey("executions.id"),
    )

    step_name = Column(String)

    status = Column(String)  # started, completed, failed

    details = Column(JSON, nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    execution = relationship(
        "Execution",
        back_populates="events",
    )


class Replay(Base):
    __tablename__ = "replays"

    id = Column(Integer, primary_key=True, index=True)

    original_execution_id = Column(
        Integer,
        ForeignKey("executions.id"),
    )

    correction_applied = Column(JSON)

    status = Column(String)  # success

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    original_execution = relationship(
        "Execution",
        back_populates="replays",
    )