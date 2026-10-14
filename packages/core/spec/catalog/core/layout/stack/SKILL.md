---
name: lacquer-stack
description: One-dimensional layout that spaces children along a single axis with a token-valued gap.
---

# Stack

> One-dimensional layout that spaces children along a single axis with a token-valued gap.
>
> component · core/layout · tier 1 · primitive · established · status: draft

Also called: VStack, HStack, BlockStack, InlineStack, Group, Stacks.

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

- Use: Any time children need consistent rhythm
- Use: Replacing ad-hoc margin utilities
- Avoid: Two-dimensional alignment is required — use grid

Pairs with: `box`, `divider`, `flex`.

AI products rely on this.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `container` |  | required | container |
| `children` |  | required | children |
| `gap` |  | required | gap |
| `optional-divider-slot` |  | required | optional divider slot |

## Variants

- **variant**: vertical | horizontal | with-dividers

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | missing | missing |  |

## Accessibility

- Accessible name: missing

ARIA: None; layout only.
Keyboard: None.

## Tokens

Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.

Consumes: `space.gap.xs`, `space.gap.sm`, `space.gap.md`, `space.gap.lg`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding's custom properties; no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`).
  Fix: Replace with the role's custom property from the binding (see spec/bindings/html.yaml).

## Sources

- https://github.com/Shopify/polaris/tree/main/polaris-react/src/components
- https://atlassian.design/components
