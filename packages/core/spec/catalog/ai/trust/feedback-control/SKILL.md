---
name: lacquer-feedback-control
description: Reason-coded feedback that can improve the system without becoming a reward for agreeableness.
---

# Feedback collection

> Reason-coded feedback that can improve the system without becoming a reward for agreeableness.
>
> component · ai/trust · tier 1 · established · status: draft

Also called: thumbs with reasons, Feedback (prompt-kit, Shape of AI), HAX G15 granular feedback, Gradio like/dislike.

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: submitted
- states.a11y: submitted
- modes.treatment: none, positive, negative-with-reason
- modes.a11y: none, positive, negative-with-reason
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: every assistant output
- Avoid: 'Was this helpful?' nags
- Avoid: thumbs as the sole training signal

Built from: `toggle-button`, `popover`, `radio-group`, `textarea`, `toast`.

Pairs with: `message-actions`, `inline-citation`, `anti-dark-patterns`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `thumbs-up-down` |  | required | thumbs up/down |
| `reason-picker` |  | required | reason picker with specific options (Inaccurate, Wrong sources, Unsafe, Not helpful, Style) |
| `free-text` |  | required | free text |
| `statement-of-what` |  | required | statement of what happens to feedback |
| `implicit-signals-captured` |  | required | implicit signals captured separately (accept/reject, edits) |

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `submitted` | missing | missing |  |

## Modes

Component-specific display modes. Same contract as states: a treatment and an a11y expression each.

| Mode | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `none` | missing | missing |  |
| `positive` | missing | missing |  |
| `negative-with-reason` | missing | missing |  |

## API (framework-neutral)

Interactions:
- one click then optional reason
- undo feedback

## Accessibility

- Accessible name: missing

Toggle buttons with pressed state; reason picker is a form; confirmation announced.

## Tokens

Roles, not values. A role is a token path in spec/tokens; the html binding reads it as `--lq-<role-with-dashes>`, the tailwind binding as an `lq-` utility (dist/bindings.json has both).

Consumes: `color.fg.muted`, `radius.sm`, `type.body.sm`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding (its custom properties or its utility classes); no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`, `bg-zinc-900`, `rounded-lg`).
  Fix: Replace with the role's `--lq-*` property or its `lq-` utility class; both are derived from the role's path in spec/tokens (see dist/bindings.json).

## Exemplars

- OpenAI (May 2025) — thumbs data amplified sycophancy; 'be critical of metrics that conflict with qualitative testing'
- PAIR — explain the value and time-to-impact of feedback

## Sources

- https://openai.com/index/expanding-on-sycophancy/
- https://pair.withgoogle.com/chapter/feedback-controls/
