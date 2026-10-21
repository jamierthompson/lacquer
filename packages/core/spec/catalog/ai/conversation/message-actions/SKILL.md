---
name: lacquer-message-actions
description: Copy, regenerate, feedback and share on every assistant message; the feedback signal must be reason-coded, not a mere 'liked it'.
---

# Message actions bar

> Copy, regenerate, feedback and share on every assistant message; the feedback signal must be reason-coded, not a mere 'liked it'.
>
> component · ai/conversation · tier 1 · established · status: draft

Also called: ActionBar (assistant-ui), MessageActions (AI Elements), Feedback (prompt-kit), like/dislike (Gradio).

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: enabled
- states.a11y: enabled
- modes.treatment: visible, on-hover-focus, feedback-given
- modes.a11y: visible, on-hover-focus, feedback-given
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: every assistant message
- Avoid: treating thumbs-up as a training reward without qualitative checks (OpenAI sycophancy incident)

Built from: `icon-button`, `tooltip`, `dropdown-menu`, `toast`.

Pairs with: `feedback-control`, `branch-picker`, `message`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `copy` |  | required | copy |
| `regenerate` |  | required | regenerate (optional model/tone submenu) |
| `thumbs-up` |  | required | thumbs up / thumbs down with reason picker |
| `share` |  | required | share |
| `read-aloud` |  | required | read aloud |
| `more` |  | required | more: report, export |

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | missing | missing |  |

## Modes

Component-specific display modes. Same contract as states: a treatment and an a11y expression each.

| Mode | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `visible` | missing | missing | visible (latest message) |
| `on-hover-focus` | missing | missing | on-hover/focus (older) |
| `feedback-given` | missing | missing |  |

## API (framework-neutral)

Interactions:
- one-click copy with toast
- regenerate creates branch
- thumbs-down opens reasons

## Accessibility

- Accessible name: missing

Labelled icon buttons; visible on focus, not hover only; reachable from the message.

## Tokens

Roles, not values. A role is a token path in spec/tokens; the html binding reads it as `--lq-<role-with-dashes>`, the tailwind binding as an `lq-` utility (dist/bindings.json has both).

Consumes: `color.fg.muted`, `radius.sm`, `space.gap.xs`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding (its custom properties or its utility classes); no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`, `bg-zinc-900`, `rounded-lg`).
  Fix: Replace with the role's `--lq-*` property or its `lq-` utility class; both are derived from the role's path in spec/tokens (see dist/bindings.json).

## Exemplars

- Perplexity — 'Wrong sources' as a distinct reason
- OpenAI (May 2025) — thumbs data amplified agreeable responses

## Sources

- https://openai.com/index/expanding-on-sycophancy/
- https://www.assistant-ui.com/docs/primitives
