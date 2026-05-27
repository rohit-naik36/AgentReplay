# AgentReplay Project State

## Current Version

v0.1.0-mvp

---

## Product Vision

AI workflow visibility + debugging + recovery platform

Replay is not a rerun button.

Replay provides:

- diagnostics
- comparison
- recovery visibility
- improvement explanation

---

## Current Architecture

Frontend:
- Next.js

Backend:
- FastAPI

Database:
- PostgreSQL

Containerization:
- Docker Compose

---

## Completed

✓ Replay workflow
✓ Lineage
✓ Comparison
✓ Diagnostics
✓ Search/filter
✓ Detected improvements banner
✓ Seed workflows

---

## Current Known Issues

- Frontend Dockerfile reverted to Node20
- Needs Node22 + pnpm10.17 fix

---

## Current Sprint Status

Phase 1:
Replay MVP
Status: Complete

Phase 2:
Execution Playground
Status: Planned

Goal:

Input
→ Execute workflow
→ Failure
→ Diagnostics
→ Replay
→ Compare

---

## Future Ideas

- Selective Recovery Engine
- Retry classification
- AI debugging copilot
- Recovery scheduling

---

## AI Collaboration Rules

The following should NOT be added to project documentation:

- agent memory checks
- hidden context checks
- internal reasoning statements
- repeated system boilerplate

Only document:

- product decisions
- architecture decisions
- sprint goals
- implementation details
- future ideas