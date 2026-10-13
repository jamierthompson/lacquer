---
name: lacquer-safety-interstitial
description: A respectful block screen that coaches the user toward a permitted request instead of shaming or exposing policy text.
---

# Safety interstitial

> A respectful block screen that coaches the user toward a permitted request instead of shaming or exposing policy text.
>
> component · ai/trust · tier 2 · established · status: draft

Also called: blocked request screen, content policy notice, Guardrails (Shape of AI).

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: enabled
- states.a11y: enabled
- modes.treatment: blocked, partially-scoped, appealed
- modes.a11y: blocked, partially-scoped, appealed
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: policy blocks
- Use: sensitive-domain scoping
- Avoid: red error styling
- Avoid: dead ends without alternatives

Built from: `card`, `alert`, `button`, `link`.

Pairs with: `error-refusal-state`, `feedback-control`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `calm` |  | required | calm, non-red panel |
| `reason-category` |  | required | reason category |
| `what-is-allowed` |  | required | what is allowed / how to rephrase |
| `appeal-or-feedback` |  | required | appeal or feedback path |
| `resources-in-sensitive` |  | required | resources in sensitive domains |

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | missing | missing |  |

## Modes

Component-specific display modes. Same contract as states: a treatment and an a11y expression each.

| Mode | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `blocked` | missing | missing |  |
| `partially-scoped` | missing | missing |  |
| `appealed` | missing | missing |  |

## API (framework-neutral)

Interactions:
- rephrase
- report false positive
- learn more

## Accessibility

- Accessible name: missing

Status region (polite), not an alert; content readable; no auto-dismiss.

## Tokens

Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.

Consumes: `color.bg.surface-secondary`, `color.border.subtle`, `type.body.sm`, `color.status.warning`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding's custom properties; no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`).
  Fix: Replace with the role's custom property from the binding (see spec/bindings/html.yaml).

## Exemplars

- Apple HIG — 'Minimize scoped or blocked output by coaching people how to be more successful next time'

## Sources

- https://developer.apple.com/design/human-interface-guidelines/generative-ai
