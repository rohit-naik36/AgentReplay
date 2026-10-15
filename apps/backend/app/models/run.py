from sqlalchemy import Column, Integer, Float, String, DateTime, JSON, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Run(Base):
    __tablename__ = "runs"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, index=True, nullable=True)
    parent_run_id = Column(Integer, ForeignKey("runs.id"), nullable=True)
    prompt = Column(String, nullable=False)
    response = Column(String, nullable=True)
    model = Column(String, nullable=True)
    latency_ms = Column(Integer, nullable=True)
    tokens_used = Column(Integer, nullable=True)
    # Cost accounting. tokens_used is kept for backward compatibility.
    input_tokens = Column(Integer, nullable=True)
    output_tokens = Column(Integer, nullable=True)
    cache_read_tokens = Column(Integer, nullable=True)
    cost_usd = Column(Float, nullable=True)  # None when the model has no configured price
    status = Column(String, nullable=False) # success, failed, replayed
    metadata_json = Column(JSON, nullable=True)

    # Failure Metadata
    error_type = Column(String, nullable=True)
    error_message = Column(String, nullable=True)
    stack_trace = Column(String, nullable=True)
    timeout_reason = Column(String, nullable=True)
    malformed_output = Column(String, nullable=True)
    token_limit_hit = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    tool_calls = relationship("ToolCall", back_populates="run", cascade="all, delete-orphan")

class ToolCall(Base):
    __tablename__ = "tool_calls"

    id = Column(Integer, primary_key=True, index=True)
    run_id = Column(Integer, ForeignKey("runs.id"), nullable=False)
    tool_name = Column(String, nullable=False)
    input_json = Column(JSON, nullable=True)
    output_json = Column(JSON, nullable=True)
    status = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    run = relationship("Run", back_populates="tool_calls")
