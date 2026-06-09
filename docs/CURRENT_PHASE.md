# Current Phase

## Phase

Sprint 3

---

# Sprint Theme

Real Agent SDK Integration

---

# Sprint Goal

Connect real AI agents to AgentReplay.

Move from:

Playground Demonstration

to

Real Agent Observability

---

# Current Priorities

Priority 1

Python SDK MVP

Priority 2

Run Ingestion API

Priority 3

Replay Validation

Priority 4

Developer Onboarding

---

# Active Tickets

## S3-001

API Key Authentication

Requirements:

* AGENTREPLAY_API_KEY
* X-API-Key validation
* Protect POST /api/runs
* Tests

Status:

Planned

---

## S3-002

Run Ingestion Validation

Requirements:

* Review schemas
* Validate payloads
* Add tests

Status:

Planned

---

## S3-003

Python SDK MVP

Requirements:

* AgentReplayClient
* track_run()
* track_tool_call()

Status:

Planned

---

## S3-004

End-to-End Example Agent

Requirements:

* Example agent
* Example failure
* Example replay

Status:

Planned

---

# Out Of Scope

Do NOT build:

* JWT Authentication
* User Accounts
* Organizations
* Teams
* RBAC
* Billing
* Stripe
* Usage Analytics
* OpenTelemetry
* LangSmith Integrations
* Multi-language SDKs

These may be future initiatives but are not part of Sprint 3.

---

# Sprint Success Criteria

A developer can:

1. Install the SDK
2. Connect an AI agent
3. Send runs to AgentReplay
4. View runs in the dashboard
5. Inspect failures
6. Replay executions
7. Compare outcomes

If this workflow works end-to-end, Sprint 3 is complete.
