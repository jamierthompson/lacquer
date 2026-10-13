---
name: lacquer-skeleton
description: Grey placeholder shapes that mirror the layout of content still loading.
---

# Skeleton

> Grey placeholder shapes that mirror the layout of content still loading.
>
> component · core/feedback · tier 1 · molecule · established · status: draft

Also called: Shimmer, Placeholder, SkeletonText, Ghost loader, Placeholders, Content loader.

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: skeleton, loading
- states.a11y: skeleton, loading
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: Loading known layouts: cards, tables, profile headers, streamed responses
- Avoid: The final layout is unpredictable — a skeleton that lies causes a jarring shift

Pairs with: `card`, `list-view`, `data-table`, `spinner`.

AI products rely on this.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `shape-primitives` |  | required | shape primitives (text, circle, rect) |
| `shimmer-animation` |  | required | shimmer animation |
| `layout-mirror` |  | required | layout mirror |

## Variants

- **variant**: text | circle | rectangle | card | table-row | pulse | wave | static
- **size**: sm | md | lg

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `skeleton` | missing | missing |  |
| `loading` | missing | missing |  |

## Accessibility

- Accessible name: missing

ARIA: Wrap in `aria-busy="true"` and `aria-hidden` the shapes; announce completion once, not per shape.
Keyboard: Not focusable.

## Tokens

Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.

Consumes: `color.bg.subtle`, `radius.control`, `motion.duration.shimmer`, `size.skeleton.line`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding's custom properties; no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`).
  Fix: Replace with the role's custom property from the binding (see spec/bindings/html.yaml).

## Sources

- https://carbondesignsystem.com/components/overview/components/
- https://github.com/Shopify/polaris/tree/main/polaris-react/src/components
