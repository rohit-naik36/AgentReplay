# AgentReplay Product Decisions

Purpose:

Capture important product and architecture decisions and WHY they were made.

---

## [Sprint 1 / v0.1]

### Decision

Replay is not positioned as rerun infrastructure.

### Reason

Users already have:

- retries
- reruns
- cron jobs
- manual re-execution

Replay alone creates weak value.

### Chosen Positioning

Replay provides:

- diagnostics
- comparison
- recovery visibility
- improvement explanation

---

## [Sprint 1 / v0.1]

### Decision

AI should not control execution workflows.

### Reason

Fully AI-driven execution:

- becomes difficult to debug
- becomes expensive
- becomes unpredictable
- hides failure causes

### Chosen Strategy

AI responsibilities:

- explain failures
- suggest corrections
- recommend actions

Rules/system responsibilities:

- execute workflows
- validate inputs
- trigger recovery logic

---

## [Sprint 1 / v0.1]

### Decision

Keep workflows deterministic in MVP.

### Reason

LLM-driven routing introduces:

- unpredictability
- debugging complexity
- extra cost

### Chosen Strategy

Workflow routing uses:

- keyword rules
- predefined workflow types

Examples:

"SKU" → Procurement

"Shipment" → Logistics

"Refund" → Escalation

---

## [Sprint 1 / v0.1]

### Decision

Replay improvements are currently simulated.

### Reason

The MVP demonstrates value before building a full recovery engine.

### Future Direction

Replay should eventually:

- diagnose failures
- apply correction strategies
- execute recovery paths
- compare actual outcomes

---

## [Sprint 2 Planning]

### Decision

Execution Playground becomes the next milestone.

### Reason

Users currently observe workflows but do not experience them.

### Goal

Allow users to:

Input
→ Execute
→ Fail naturally
→ Diagnostics
→ Replay
→ Suggested correction
→ Compare outcomes