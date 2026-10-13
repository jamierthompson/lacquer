---
name: lacquer-data-use-notice
description: Tells users what data the AI uses and whether it trains on it, with a one-tap opt-out and manual fallback.
---

# Data-use / training notice and consent

> Tells users what data the AI uses and whether it trains on it, with a one-tap opt-out and manual fallback.
>
> component · ai/trust · tier 1 · established · status: draft

Also called: Consent, Data ownership (Shape of AI), Improve the model for everyone toggle (ChatGPT), not used for training badge (enterprise).

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: enabled
- states.a11y: enabled
- modes.treatment: not-asked, opted-in, opted-out, enterprise-locked
- modes.a11y: not-asked, opted-in, opted-out, enterprise-locked
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: any product that stores prompts or personal data
- Avoid: burying opt-out
- Avoid: saving memories silently

Built from: `switch`, `alert`, `dialog`, `link`.

Pairs with: `memory-indicator`, `first-run-education`, `ai-label`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `first-run-notice` |  | required | first-run notice: what is stored, whether it trains, retention |
| `settings-toggle` |  | required | settings toggle with plain description |
| `per-feature-permission-prompt` |  | required | per-feature permission prompt for personal data |
| `reset-personalisation` |  | required | reset personalisation |

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | missing | missing |  |

## Modes

Component-specific display modes. Same contract as states: a treatment and an a11y expression each.

| Mode | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `not-asked` | missing | missing |  |
| `opted-in` | missing | missing |  |
| `opted-out` | missing | missing |  |
| `enterprise-locked` | missing | missing |  |

## API (framework-neutral)

Interactions:
- opt out in one tap
- learn more
- reset

## Accessibility

- Accessible name: missing

Switch semantics with description; notice is readable text, not a modal trap.

## Tokens

Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.

Consumes: `color.bg.surface-secondary`, `type.body.sm`, `color.border.subtle`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding's custom properties; no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`).
  Fix: Replace with the role's custom property from the binding (see spec/bindings/html.yaml).

## Exemplars

- Apple HIG — 'Use the minimum data you need and always offer a clear way to opt out'
- PAIR — allow users to turn it off and reset personalisation

## Sources

- https://developer.apple.com/design/human-interface-guidelines/generative-ai
- https://pair.withgoogle.com/chapter/feedback-controls/
