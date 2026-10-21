---
name: lacquer-scheduled-task-ui
description: Management UI for agents that run on a schedule: plain-language cadence, run history, and distinct failure states.
---

# Scheduled / recurring task UI

> Management UI for agents that run on a schedule: plain-language cadence, run history, and distinct failure states.
>
> component · ai/agentic · tier 3 · emerging · status: draft

Also called: Tasks (ChatGPT), scheduled tasks (Claude Code), cloud agent schedules (Cursor).

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: active
- states.a11y: active
- modes.treatment: paused, failed-last-run, one-shot-fired
- modes.a11y: paused, failed-last-run, one-shot-fired
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: recurring automations
- Avoid: one-off tasks

Built from: `table`, `form`, `switch`, `badge`, `dialog`.

Pairs with: `background-job-card`, `activity-log`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `list` |  | required | list: name, cadence in plain language, next run, last status |
| `run-history` |  | required | run history (job cards) |
| `editor` |  | required | editor: natural-language prompt + structured cadence picker |
| `notification-preferences` |  | required | notification preferences |

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `active` | missing | missing |  |

## Modes

Component-specific display modes. Same contract as states: a treatment and an a11y expression each.

| Mode | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `paused` | missing | missing |  |
| `failed-last-run` | missing | missing |  |
| `one-shot-fired` | missing | missing |  |

## API (framework-neutral)

Interactions:
- create
- pause/resume
- run now
- edit prompt
- delete

## Accessibility

- Accessible name: missing

Table semantics; cadence stated as text; status not colour-only.

## Tokens

Roles, not values. A role is a token path in spec/tokens; the html binding reads it as `--lq-<role-with-dashes>`, the tailwind binding as an `lq-` utility (dist/bindings.json has both).

Consumes: `type.body.sm`, `color.status.success`, `color.status.error`, `color.border.subtle`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding (its custom properties or its utility classes); no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`, `bg-zinc-900`, `rounded-lg`).
  Fix: Replace with the role's `--lq-*` property or its `lq-` utility class; both are derived from the role's path in spec/tokens (see dist/bindings.json).

## Exemplars

- ChatGPT Tasks; Claude Code scheduled tasks (product behaviour)

## Sources

- https://help.openai.com/en/articles/6825453-chatgpt-release-notes
