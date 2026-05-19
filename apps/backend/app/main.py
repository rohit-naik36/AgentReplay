from fastapi import FastAPI
from app.api import router
from app.core.database import engine, Base

# Create database tables
# Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AgentReplay API",
    description="Backend API for AgentReplay - A lightweight AI agent observability and replay platform.",
    version="1.0.0"
)

app.include_router(router, prefix="/api")

@app.get("/health")
def health_check():
    return {"status": "ok"}
