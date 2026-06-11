# AgentReplay Python SDK

This is the lightweight Python SDK for interacting with the AgentReplay API.

## Installation

You can install this locally for development using:

```bash
pip install -e .
```

## Usage

```python
from agentreplay import track_run

# Synchronous tracking
run = track_run(
    prompt="Summarize this document",
    response="Summary here",
    model="gpt-4",
    latency_ms=1200,
    tokens_used=820,
    status="success"
)

print(run)

# Asynchronous tracking
import asyncio
from agentreplay import track_run_async

async def main():
    run = await track_run_async(
        prompt="Summarize this document",
        response="Summary here",
        model="gpt-4",
        latency_ms=1200,
        tokens_used=820,
        status="success"
    )
    print(run)

asyncio.run(main())
```

## Configuration

By default, the SDK points to `http://localhost:8000/api`. You can override this by setting the `AGENTREPLAY_API_URL` environment variable.
