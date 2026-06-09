# AgentReplay

AgentReplay is a lightweight AI agent observability and replay platform for developers. It acts as "DevTools for AI agents," helping developers debug AI agent workflows by providing insights into why an agent failed, prompt/response details, tool call execution, token usage, latency, and more.

## Architecture

* **Frontend:** Next.js 15 (App Router), TypeScript, TailwindCSS, shadcn/ui.
* **Backend:** FastAPI, Python 3.12.
* **Database:** PostgreSQL.
* **SDK:** Lightweight Python SDK (`agentreplay`) to easily integrate with your Python applications.

## Local Setup

### Prerequisites

* Docker & Docker Compose
* Node.js & pnpm (if running frontend locally outside docker)
* Python 3.12+ (if running backend locally outside docker)

### Running with Docker Compose (Recommended)

1. Clone the repository and navigate to the root directory.
2. Copy the example environment variables and configure your `AGENTREPLAY_API_KEY`:
   ```bash
   cp .env.example .env
   # Ensure you set AGENTREPLAY_API_KEY in the .env file
   ```
3. Start the services using Docker Compose:
   ```bash
   docker compose up --build
   ```

This will start:
* **PostgreSQL:** `localhost:5432`
* **FastAPI Backend:** `http://localhost:8000` (API docs at `http://localhost:8000/docs`)
* **Next.js Frontend:** `http://localhost:3000`

The backend container will automatically run database migrations and seed the database with realistic mock data upon startup.

### Running Externally

If you prefer to run the services directly on your host machine:

#### Backend
```bash
cd apps/backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
# Run migrations & seed data (implementation details to follow)
uvicorn main:app --reload
```

#### Frontend
```bash
cd apps/frontend
pnpm install
pnpm dev
```

## Usage

### Using the Python SDK

1. Install the SDK locally (or via pip once published):
   ```bash
   cd packages/python-sdk
   pip install -e .
   ```
2. Track a run in your AI application:
   ```python
   from agentreplay import track_run

   # Ensure AGENTREPLAY_API_KEY is available in your environment variables
   import os
   os.environ["AGENTREPLAY_API_KEY"] = "sk-your-secure-api-key"

   track_run(
       prompt="Summarize this document",
       response="Summary here",
       model="gpt-4",
       latency_ms=1200,
       tokens_used=820,
       status="success"
   )
   ```

### API Endpoints

The backend provides a RESTful API. Some key endpoints:
* `POST /runs`: Log a new agent run.
* `GET /runs`: List and filter runs.
* `GET /runs/{id}`: Get details of a specific run.
* `POST /runs/{id}/replay`: Mock replay a specific run.
* `GET /health`: Health check endpoint.
