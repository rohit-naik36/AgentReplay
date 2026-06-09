# Product Principles

These principles should guide all product and engineering decisions.

---

# Principle 1

Replay Is The Product

The strongest product capability is:

Failure
→ Diagnosis
→ Replay
→ Validation

Features that strengthen this workflow should be prioritized.

Features that distract from this workflow should be questioned.

---

# Principle 2

MVP First

Prefer:

* Simpler implementations
* Faster shipping
* Faster validation

Avoid:

* Premature optimization
* Premature scaling
* Enterprise abstractions

Ask:

"What is the smallest version that delivers value?"

---

# Principle 3

Developer Experience Matters

AgentReplay is a developer tool.

Every feature should be easy to:

* Understand
* Integrate
* Use

Reduce friction wherever possible.

---

# Principle 4

Visibility Before Automation

Before building AI-generated fixes:

Build visibility.

Users must understand:

* What happened
* Why it happened
* What changed

before trusting automation.

---

# Principle 5

Prefer Deterministic Systems

Prefer:

* Rules
* Validation
* Explicit logic

before introducing AI-driven behavior.

Deterministic systems are easier to:

* Test
* Debug
* Explain

---

# Principle 6

Avoid Infrastructure Complexity

Do not introduce infrastructure unless it solves a real problem.

Avoid:

* Kafka
* Redis
* Celery
* Event buses
* Microservices

until clearly justified.

---

# Principle 7

Reuse Existing Patterns

Before creating:

* New services
* New abstractions
* New frameworks

look for existing solutions in the codebase.

---

# Principle 8

One Product At A Time

AgentReplay is:

AI Agent Observability + Replay

AgentReplay is not:

* A workflow builder
* A chatbot platform
* A vector database
* An orchestration framework

Stay focused on the core problem.

---

# Principle 9

Every Feature Must Answer

Who is this for?

What painful problem does it solve?

Why would someone pay for it?

Can it be simplified?

---

# Principle 10

Optimize For Learning Speed

The objective is not perfect architecture.

The objective is learning:

* What users want
* What they will pay for
* What creates retention

Ship fast and learn quickly.
