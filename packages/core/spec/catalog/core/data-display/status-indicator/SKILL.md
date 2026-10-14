---
name: lacquer-status-indicator
description: A small dot or light conveying operational or presence status, always paired with text.
---

# Status Indicator

> A small dot or light conveying operational or presence status, always paired with text.
>
> component · core/data-display · tier 2 · atom · established · status: draft

Also called: Status light, Indicator, StateLabel, PresenceBadge, Dot, Health dot.

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: enabled
- states.a11y: enabled
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: Service health, user presence, job/run state, model availability
- Avoid: Colour is the only differentiator between states

Pairs with: `avatar`, `list-view`, `stat`, `tag`.

AI products rely on this.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `dot-ring` |  | required | dot/ring |
| `label-text` |  | required | label text |
| `optional-pulse-animation` |  | required | optional pulse animation |

## Variants

- **variant**: neutral | info | success | warning | danger | pending | pulsing
- **size**: sm | md

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | missing | missing |  |

## Accessibility

- Accessible name: missing

ARIA: Dot is `aria-hidden`; the status must exist as text or via `aria-label` on the container.
Keyboard: None.

## Tokens

Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.

Consumes: `color.bg.success`, `color.bg.danger`, `size.icon.xs`, `radius.full`, `motion.duration.slow`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding's custom properties; no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`).
  Fix: Replace with the role's custom property from the binding (see spec/bindings/html.yaml).

## Sources

- https://opensource.adobe.com/spectrum-design-data/components
- https://github.com/Shopify/polaris/tree/main/polaris-react/src/components
