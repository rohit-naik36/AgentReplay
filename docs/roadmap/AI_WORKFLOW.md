# AI Development Workflow

## Purpose

This document explains how AgentReplay is developed using AI-assisted workflows.

It serves as onboarding context for future AI agents and contributors.

---

# Development Philosophy

Priorities:

1. MVP First
2. Simplicity First
3. Validation First
4. Shipping Over Perfection

Avoid:

* Premature optimization
* Enterprise architecture
* Infrastructure complexity
* Feature bloat

---

# AI Collaboration Model

The project uses multiple AI systems.

## ChatGPT

Primary responsibilities:

* Product strategy
* Sprint planning
* Architecture reviews
* UX reviews
* Prioritization
* Documentation
* Technical decision support

## Jules

Primary responsibilities:

* Code implementation
* Refactoring
* UI development
* Bug fixes
* Pull requests
* Build verification

---

# Sprint Workflow

## Phase 1

Define sprint goals.

Deliverables:

* Goal
* Scope
* Success criteria
* Out-of-scope items

## Phase 2

Review architecture.

Confirm:

* Data model
* API design
* UI changes

before implementation begins.

## Phase 3

Implementation.

Work is split into small focused branches.

Prefer:

* Small PRs
* Clear commit messages
* Independent reviewable changes

## Phase 4

Product review.

Review:

* UX
* Workflow clarity
* Product positioning
* User value

before accepting implementation.

---

# Documentation Standards

Every completed sprint should contain:

* Sprint review
* Product decisions
* Architecture updates

Documentation is treated as a first-class deliverable.

---

# Product Vision

AgentReplay is an AI Agent Failure Analysis Platform.

Long-term workflow:

Observe AI Agents
↓
Explain Failures
↓
Recommend Improvements
↓
Validate Fixes
↓
Optimize Cost
↓
Optimize Context
↓
Optimize Architecture

Replay is not the product.

Replay is the validation mechanism.

The product is failure understanding and improvement.

---

# Important Rule

When proposing features:

Always ask:

"What is the smallest version that delivers value?"

before proposing additional complexity.
