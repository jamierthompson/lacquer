---
name: lacquer-background-job-card
description: Runs the user can leave: a card with status and summary in an inbox, plus distinct done vs needs-input notifications.
---

# Background job card and run notifications

> Runs the user can leave: a card with status and summary in an inbox, plus distinct done vs needs-input notifications.
>
> component · ai/agentic · tier 2 · emerging · status: draft

Also called: cloud/background agents (Cursor, Codex, Claude Code on the web, Devin), Deep Research (Gemini, ChatGPT), builds (Lovable), tasks list (ChatGPT).

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: input-available, cancelled
- states.a11y: input-available, cancelled
- modes.treatment: queued, needs-input, done, failed
- modes.a11y: queued, needs-input, done, failed
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: runs longer than ~30–60 s
- Use: parallel agents
- Avoid: short interactive turns

Built from: `card`, `badge`, `progress`, `toast`, `list`, `button`.

Pairs with: `agent-status`, `multi-agent-view`, `scheduled-task-ui`, `generation-progress`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `card` |  | required | card: title, status, started-ago, progress, summary line when done |
| `actions` |  | required | actions: Open, Stop, Retry |
| `inbox-list-of-runs` |  | required | inbox/list of runs |
| `notification-on-done` |  | required | notification on done and on needs-input (distinct), deep-linked |

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `input-available` | missing | missing |  |
| `cancelled` | missing | missing |  |

## Modes

Component-specific display modes. Same contract as states: a treatment and an a11y expression each.

| Mode | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `queued` | missing | missing |  |
| `needs-input` | missing | missing |  |
| `done` | missing | missing |  |
| `failed` | missing | missing |  |

## API (framework-neutral)

Interactions:
- open run
- stop
- retry
- mark read

## Accessibility

- Accessible name: missing

Card is an article with status text; notifications use platform channels plus an in-app status region; needs-input is assertive.

## Tokens

Roles, not values. A role is a token path in spec/tokens; the html binding reads it as `--lq-<role-with-dashes>`, the tailwind binding as an `lq-` utility (dist/bindings.json has both).

Consumes: `color.status.pending`, `color.status.running`, `color.status.warning`, `color.status.success`, `color.status.error`, `radius.md`, `color.bg.surface-raised`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding (its custom properties or its utility classes); no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`, `bg-zinc-900`, `rounded-lg`).
  Fix: Replace with the role's `--lq-*` property or its `lq-` utility class; both are derived from the role's path in spec/tokens (see dist/bindings.json).

## Exemplars

- Cursor 3.0 — Agents Window for parallel local/cloud runs
- NN/g — ChatGPT Agent took 11 minutes for a 2-minute task; background it

## Sources

- https://cursor.com/changelog/3-0
- https://www.nngroup.com/articles/impressions-chatgpt-agent/
