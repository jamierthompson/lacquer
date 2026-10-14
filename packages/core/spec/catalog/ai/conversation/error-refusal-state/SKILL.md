---
name: lacquer-error-refusal-state
description: Three distinct designs: transport errors (retry, keep draft), refusals (calm, offer alternatives) and quota notices (facts and reset time).
---

# Error, refusal and scoped-answer states

> Three distinct designs: transport errors (retry, keep draft), refusals (calm, offer alternatives) and quota notices (facts and reset time).
>
> component · ai/conversation · tier 1 · established · status: draft

Also called: Error primitive (assistant-ui), AI SDK error status, blocked/scoped response, Caveat (Shape of AI).

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: cancelled
- states.a11y: cancelled
- modes.treatment: network-error, model-error, refused, scoped, rate-limited
- modes.a11y: network-error, model-error, refused, scoped, rate-limited
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: always
- Avoid: rendering refusals in red error styling
- Avoid: losing the user's draft on any error

Built from: `alert`, `alert`, `button`, `link`.

Pairs with: `message`, `quota-notice`, `safety-interstitial`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `transport-error` |  | required | transport error: inline in assistant slot, message, Retry, user text preserved |
| `refusal-scoped` |  | required | refusal/scoped: calm normal message with what can be done next |
| `quota` |  | required | quota: banner with reset time and upgrade path, send disabled, draft kept |

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `cancelled` | missing | missing |  |

## Modes

Component-specific display modes. Same contract as states: a treatment and an a11y expression each.

| Mode | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `network-error` | missing | missing |  |
| `model-error` | missing | missing |  |
| `refused` | missing | missing |  |
| `scoped` | missing | missing |  |
| `rate-limited` | missing | missing |  |

## API (framework-neutral)

Interactions:
- retry
- edit prompt
- report
- learn more

## Accessibility

- Accessible name: missing

Errors use role=alert; refusals are ordinary messages (polite); quota banner is a status region.

## Tokens

Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.

Consumes: `color.status.error`, `color.status.warning`, `color.bg.surface-secondary`, `radius.md`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding's custom properties; no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`).
  Fix: Replace with the role's custom property from the binding (see spec/bindings/html.yaml).

## Exemplars

- assistant-ui Error — accessible alert role with automatic text
- Apple HIG — help people improve requests when blocked

## Sources

- https://www.assistant-ui.com/docs/primitives
- https://pair.withgoogle.com/chapter/errors-failing/
- https://developer.apple.com/design/human-interface-guidelines/generative-ai
