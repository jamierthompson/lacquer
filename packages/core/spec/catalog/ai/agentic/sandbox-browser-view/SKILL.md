---
name: lacquer-sandbox-browser-view
description: Shows what an agent is doing in a browser or sandbox, with narration, approvals and a take-over control.
---

# Sandbox / browser-use view

> Shows what an agent is doing in a browser or sandbox, with narration, approvals and a take-over control.
>
> component · ai/agentic · tier 3 · experimental · status: draft

Also called: Sandbox, WebPreview (AI Elements), live browser window (ChatGPT Agent), in-editor browser (Cursor), computer-use screenshots.

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: enabled
- states.a11y: enabled
- modes.treatment: agent-driving, user-driving, paused-for-approval, ended
- modes.a11y: agent-driving, user-driving, paused-for-approval, ended
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: browser or computer-use agents
- Avoid: a constrained viewport that hides what is being entered

Built from: `iframe`, `image`, `toolbar`, `button`, `badge`.

Pairs with: `approval-prompt`, `activity-log`, `agent-status`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `live-or-screenshot` |  | required | live or screenshot stream |
| `agent-narration-alongside` |  | required | agent narration alongside |
| `take-over` |  | required | Take over / Give back control |
| `clear-boundary-between` |  | required | clear boundary between agent and user actions |
| `url-and-navigation` |  | required | URL and navigation |

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | missing | missing |  |

## Modes

Component-specific display modes. Same contract as states: a treatment and an a11y expression each.

| Mode | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `agent-driving` | missing | missing |  |
| `user-driving` | missing | missing |  |
| `paused-for-approval` | missing | missing |  |
| `ended` | missing | missing |  |

## API (framework-neutral)

Interactions:
- take over
- approve step
- stop
- open full size

## Accessibility

- Accessible name: missing

Narration is text in a log region; screenshots have descriptions; take-over is a button with focus management.

## Tokens

Roles, not values. A role is a token path in spec/tokens; the html binding reads it as `--lq-<role-with-dashes>`, the tailwind binding as an `lq-` utility (dist/bindings.json has both).

Consumes: `color.bg.surface`, `color.border.strong`, `radius.md`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding (its custom properties or its utility classes); no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`, `bg-zinc-900`, `rounded-lg`).
  Fix: Replace with the role's `--lq-*` property or its `lq-` utility class; both are derived from the role's path in spec/tokens (see dist/bindings.json).

## Exemplars

- NN/g (Aug 2025) — screenshots and narration built trust; constrained window limited visibility

## Sources

- https://www.nngroup.com/articles/impressions-chatgpt-agent/
- https://elements.ai-sdk.dev/components/web-preview
