## [2026-05-24]

### Decision

Replay improvements are currently simulated for MVP demonstration.

### Reason

The system currently demonstrates user value before implementing real recovery execution.

### Future Direction

Replay should:

- diagnose
- apply correction strategies
- execute real recovery paths
- compare actual outcomes

## [Sprint 2]

### Decision

Execution Playground should support Natural Language input by default.

### Reason

Users think in requests, not JSON payloads.

Examples:

"Need 500 units of sku123 delivered next week"

instead of:

{
  "workflow":"procurement"
}

### Chosen Strategy

Default:
Natural Language mode

Optional:
Raw JSON mode

---

## [Sprint 2]

### Decision

Tooltips should exist throughout the platform.

### Reason

Users should understand fields without external explanation.

### Chosen Strategy

Create reusable InfoTooltip component.

Targets:

Dashboard:
- Status
- Latency
- Tokens
- Model
- Replay
- Lineage

Playground:
- Workflow
- Timeline
- Diagnostics
- Suggested Correction

---

## [Sprint 2]

### Decision

Dropdowns should render above containers.

### Reason

Dropdown clipping reduces usability and trust.

### Chosen Strategy

Use portal rendering / proper z-index handling.

## [Sprint 2]

### Decision

Separate AI implementation and review responsibilities.

### Reason

Single-agent workflows risk:

- missed UX issues
- overconfidence
- regression blindness
- unnecessary architecture changes

### Chosen Strategy

Jules:

Primary builder

Antigravity:

Reviewer / critic

Workflow:

Sprint Planning
↓
Jules implements
↓
User validates
↓
Antigravity critiques
↓
User selects changes
↓
Jules implements revisions
↓
Validate and merge

## [Sprint 2]

### Decision

Avoid CrewAI orchestration during MVP phase.

### Reason

Current workflows are deterministic and introducing multi-agent orchestration adds significant operational complexity.

### Chosen Strategy

MVP:

Rules-based workflow execution

AI responsibilities:

- explain failures
- suggest corrections
- summarize outcomes

Future:

CrewAI may be evaluated for Recovery Intelligence and autonomous recovery workflows.