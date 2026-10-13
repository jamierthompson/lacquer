---
name: lacquer-grid
description: Two-dimensional layout with responsive column tracks and token gaps.
---

# Grid

> Two-dimensional layout with responsive column tracks and token gaps.
>
> component · core/layout · tier 2 · primitive · established · status: draft

Also called: SimpleGrid, InlineGrid, Row/Col, Layout grid.

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

- Use: Card galleries, dashboards, form column layouts
- Use: Content must align across rows
- Avoid: A single axis is enough
- Avoid: Content order must change per breakpoint in ways grid areas obscure

Pairs with: `card`, `container`, `stat`.

AI products rely on this.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `grid-container` |  | required | grid container |
| `grid-items` |  | required | grid items |
| `column-tracks` |  | required | column tracks |
| `row-gap` |  | required | row gap |
| `column-gap` |  | required | column gap |

## Variants

- **variant**: fixed-columns | auto-fit | 12-column | masonry

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

Consumes: `space.gap.md`, `space.gap.lg`, `breakpoint.sm`, `breakpoint.md`, `breakpoint.lg`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding's custom properties; no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`).
  Fix: Replace with the role's custom property from the binding (see spec/bindings/html.yaml).

## Sources

- https://atlassian.design/components
- https://chakra-ui.com/docs/components/concepts/overview
