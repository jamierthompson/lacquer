---
name: lacquer-generation-progress
description: A ladder from shimmer to steps to a real determinate bar, with a background-job hand-off for long runs.
---

# Generation progress

> A ladder from shimmer to steps to a real determinate bar, with a background-job hand-off for long runs.
>
> component · ai/generation · tier 1 · established · status: draft

Also called: Shimmer / Plan streaming (AI Elements), st.status (Streamlit), Deep Research progress, image generation percent + blurred preview.

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: indeterminate
- states.a11y: indeterminate
- modes.treatment: stepped, determinate, backgrounded, done, failed
- modes.a11y: stepped, determinate, backgrounded, done, failed
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: any generation longer than a second
- Avoid: invented progress values
- Avoid: showing 100% before the result

Built from: `progress`, `skeleton`, `list`, `spinner`.

Pairs with: `thinking-indicator`, `background-job-card`, `latency-patterns`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `indeterminate-shimmer` |  | required | indeterminate shimmer (<5 s) |
| `step-list` |  | required | step list with active step (5 s–1 min) |
| `determinate-bar` |  | required | determinate bar with count or ETA (>1 min, real numbers only) |
| `background-job-hand-off` |  | required | background job hand-off |

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `indeterminate` | missing | missing |  |

## Modes

Component-specific display modes. Same contract as states: a treatment and an a11y expression each.

| Mode | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `stepped` | missing | missing |  |
| `determinate` | missing | missing |  |
| `backgrounded` | missing | missing |  |
| `done` | missing | missing |  |
| `failed` | missing | missing |  |

## API (framework-neutral)

Interactions:
- stop
- run in background
- open partial results

## Accessibility

- Accessible name: missing

progressbar semantics when determinate; status region for step changes (once per step).

## Tokens

Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.

Consumes: `shimmer.duration`, `color.accent.brand`, `color.status.running`, `type.body.sm`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding's custom properties; no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`).
  Fix: Replace with the role's custom property from the binding (see spec/bindings/html.yaml).

## Exemplars

- Apple HIG — generate in the background while a person uses another part of the app
- Perplexity — visible retrieval steps

## Sources

- https://developer.apple.com/design/human-interface-guidelines/generative-ai
- https://elements.ai-sdk.dev/components/plan
