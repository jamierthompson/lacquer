---
name: lacquer-bleed
description: Negates parent padding so a child can run edge to edge.
---

# Bleed

> Negates parent padding so a child can run edge to edge.
>
> component · core/layout · tier 3 · primitive · established · status: draft

Also called: FullBleed, NegativeMargin, Edge-to-edge.

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

- Use: Card media that must touch the card edge
- Use: Full-width table inside a padded panel
- Avoid: You can simply move the padding to the correct element

Pairs with: `card`, `image`, `table`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `negative-margin-wrapper` |  | required | negative-margin wrapper |

## Variants

- **variant**: horizontal | vertical | all
- **size**: sm | md | lg

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | missing | missing |  |

## Accessibility

- Accessible name: missing

ARIA: None.
Keyboard: None.

## Tokens

Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.

Consumes: `space.inset.md`, `space.inset.lg`.

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
