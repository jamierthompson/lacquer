---
name: lacquer-aspect-ratio
description: Reserves a fixed width-to-height box so media loads without layout shift.
---

# Aspect Ratio

> Reserves a fixed width-to-height box so media loads without layout shift.
>
> component · core/layout · tier 2 · primitive · established · status: draft

Also called: Ratio, Embed responsive.

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: enabled, loading, skeleton
- states.a11y: enabled, loading, skeleton
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: Video embeds, thumbnails, image grids
- Use: Cumulative Layout Shift matters
- Avoid: Intrinsic media dimensions are already known and set

Pairs with: `image`, `video-player`, `card`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `ratio-box` |  | required | ratio box |
| `absolutely-positioned-child` |  | required | absolutely positioned child |

## Variants

- **variant**: 1:1 | 4:3 | 16:9 | custom

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | missing | missing |  |
| `loading` | missing | missing |  |
| `skeleton` | missing | missing |  |

## Accessibility

- Accessible name: missing

ARIA: None.
Keyboard: None.

## Tokens

Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.

Consumes: `radius.surface`, `color.bg.subtle`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding's custom properties; no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`).
  Fix: Replace with the role's custom property from the binding (see spec/bindings/html.yaml).

## Sources

- https://www.radix-ui.com/primitives/docs/overview/introduction
- https://ui.shadcn.com/docs/components
