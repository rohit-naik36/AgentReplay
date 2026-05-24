# AgentReplay Idea Log

Purpose:
Capture ideas before implementation.

---

## [2026-05-24]

### Title
Execution Playground

### Problem
Users observe runs but do not experience workflows.

### Idea

Input
→ Execute workflow
→ Failure
→ Diagnostics
→ Replay
→ Compare

### Goal

Allow users to experience debugging flow.

### Status

Future

---

## [2026-05-24]

### Title

Replay Assisted Correction

### Problem

Replay currently feels like rerun.

### Idea

Input
→ Execute
→ Fail naturally
→ Explain failure
→ Suggest correction
→ Replay
→ Compare outcomes

### Status

Future

---

## [2026-05-24]

### Title

Selective Recovery Engine

### Problem

Re-running large datasets is expensive.

### Idea

1M records
→ identify failed subset
→ replay only failures

Recovery Types:

AUTO_RETRY
HUMAN_REVIEW
STOP_EXECUTION

### Status

Future
## [Today]

### Title

Execution Playground

### Flow

Input
→ Execute workflow
→ Fail naturally
→ Diagnostics
→ Replay
→ Suggested correction
→ Compare outcomes

Status:
Planned
## [Today]

### Title

Selective Recovery Engine

### Problem

Large datasets should not replay entirely.

### Flow

Execution
→ Identify failed records
→ Classify failures

AUTO_RETRY
HUMAN_REVIEW
STOP_EXECUTION

Status:
Future
