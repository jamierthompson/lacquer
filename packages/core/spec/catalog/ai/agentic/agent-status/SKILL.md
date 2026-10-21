---
name: lacquer-agent-status
description: A persistent, plain-language indicator of what the agent is doing and whether it is blocked on the human.
---

# Agent status and step progress

> A persistent, plain-language indicator of what the agent is doing and whether it is blocked on the human.
>
> component · ai/agentic · tier 1 · emerging · status: draft

Also called: Agents window status (Cursor), status bar mode indicator (Claude Code), CopilotKit agent state, run status pill.

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: cancelled
- states.a11y: cancelled
- modes.treatment: thinking, working, waiting-for-tool, needs-input, paused, done, failed
- modes.a11y: thinking, working, waiting-for-tool, needs-input, paused, done, failed
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: any long-running agent
- Avoid: hiding 'needs input' inside the transcript where it can be missed

Built from: `badge`, `spinner`, `button`, `tooltip`.

Pairs with: `plan-view`, `background-job-card`, `hitl-gate`, `autonomy-dial`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `status-pill` |  | required | status pill: thinking / working (current step) / waiting-for-tool / needs-input / paused / done / failed / cancelled |
| `current-mode-label` |  | required | current mode label |
| `elapsed-time` |  | required | elapsed time |
| `stop-and-pause` |  | required | stop and pause controls |

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `cancelled` | missing | missing |  |

## Modes

Component-specific display modes. Same contract as states: a treatment and an a11y expression each.

| Mode | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `thinking` | missing | missing |  |
| `working` | missing | missing |  |
| `waiting-for-tool` | missing | missing |  |
| `needs-input` | missing | missing |  |
| `paused` | missing | missing |  |
| `done` | missing | missing |  |
| `failed` | missing | missing |  |

## API (framework-neutral)

Interactions:
- stop
- pause/resume
- open run
- answer question without stopping unrelated work

## Accessibility

- Accessible name: missing

Status region announces transitions once; needs-input is assertive; mode label is text, not colour only.

## Tokens

Roles, not values. A role is a token path in spec/tokens; the html binding reads it as `--lq-<role-with-dashes>`, the tailwind binding as an `lq-` utility (dist/bindings.json has both).

Consumes: `color.status.running`, `color.status.warning`, `color.status.success`, `color.status.error`, `type.label.sm`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding (its custom properties or its utility classes); no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`, `bg-zinc-900`, `rounded-lg`).
  Fix: Replace with the role's `--lq-*` property or its `lq-` utility class; both are derived from the role's path in spec/tokens (see dist/bindings.json).

## Exemplars

- Claude Code — '⏸ plan mode on', '⏵⏵ auto mode on' in the status bar
- Cursor 2.4 — agents ask clarifying questions while continuing file operations

## Sources

- https://code.claude.com/docs/en/permission-modes
- https://cursor.com/changelog/2-4
