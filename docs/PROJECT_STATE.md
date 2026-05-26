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

Status:
In Progress

Completed:

✓ Backend execution routes
✓ Execution models
✓ Replay flow
✓ Timeline
✓ Diagnostics
✓ Comparison
✓ Deterministic workflows

Known Issues:

- Tooltip system incomplete
- Dropdown clipping issues
- Natural language input UX still needs polish
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

## AI Collaboration Model

Primary Builder:

Jules

Responsibilities:

- implement sprint tasks
- create PRs
- wire frontend/backend/database
- fix bugs
- maintain architecture consistency

---

Reviewer / Critic:

Antigravity

Responsibilities:

- identify UX problems
- identify regressions
- identify edge cases
- identify missing user journeys
- identify architectural risks
- identify overengineering
- suggest simplifications

Rules:

- critique before rebuilding
- preserve MVP-first principles
- avoid introducing unnecessary complexity
- avoid redesigning architecture unless required