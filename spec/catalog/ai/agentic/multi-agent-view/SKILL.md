---
name: lacquer-multi-agent-view
description: A list of runs is the baseline shape; graph canvases are a product in themselves.
---

# Multi-agent views

> A list of runs is the baseline shape; graph canvases are a product in themselves.
>
> component · ai/agentic · tier 3 · experimental · status: draft

Also called: Agents Window / Agent Tabs (Cursor), agent teams (Claude Code), parallel tasks (Codex), Workflow canvas (AI Elements: Canvas, Node, Edge, Connection, Controls, Panel, Toolbar).

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: input-available
- states.a11y: input-available
- modes.treatment: needs-input, done, comparing
- modes.a11y: needs-input, done, comparing
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: parallel agents on one task or many
- Avoid: building a graph canvas when a run list suffices

Built from: `list`, `kanban-board`, `tabs`, `card`, `table`.

Pairs with: `background-job-card`, `agent-status`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `list-kanban-of-runs` |  | required | list/kanban of runs (each a job card) grouped by status |
| `side-by-side-chat-tabs` |  | required | side-by-side chat tabs or grid |
| `optional-graph-canvas` |  | required | optional graph canvas for authored workflows |
| `compare-outputs` |  | required | compare outputs (best-of-n) |

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `input-available` | missing | missing |  |

## Modes

Component-specific display modes. Same contract as states: a treatment and an a11y expression each.

| Mode | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `needs-input` | missing | missing |  |
| `done` | missing | missing |  |
| `comparing` | missing | missing |  |

## API (framework-neutral)

Interactions:
- open run
- compare
- merge/select winner
- stop all

## Accessibility

- Accessible name: missing

List semantics for runs; canvas requires a list alternative; comparison as a table.

## Tokens

Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.

Consumes: `color.bg.surface-secondary`, `color.border.subtle`, `color.status.running`, `color.status.success`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding's custom properties; no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`).
  Fix: Replace with the role's custom property from the binding (see spec/bindings/html.yaml).

## Exemplars

- Cursor 2.0/3.0 — up to eight agents in parallel, worktrees, /best-of-n

## Sources

- https://cursor.com/changelog/2-0
- https://cursor.com/changelog/3-0
- https://elements.ai-sdk.dev/overview
