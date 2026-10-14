---
name: lacquer-truncate
description: Clips overflowing text to one or more lines with an ellipsis and a way to see the full value.
---

# Truncate

> Clips overflowing text to one or more lines with an ellipsis and a way to see the full value.
>
> component · core/utilities · tier 2 · primitive · established · status: draft

Also called: Ellipsis, LineClamp, Spoiler, Text overflow, OverflowList.

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: enabled, expanded
- states.a11y: enabled, expanded
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: Table cells, file names, chat titles, long identifiers
- Avoid: The truncated portion is the distinguishing part — middle-truncate instead

Pairs with: `tooltip`, `table`, `list-view`.

AI products rely on this.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `clamped-text` |  | required | clamped text |
| `ellipsis` |  | required | ellipsis |
| `tooltip-or-expand` |  | required | tooltip or expand affordance |
| `title-attribute` |  | required | title attribute |

## Variants

- **variant**: single-line | multi-line clamp | middle-truncate | with-tooltip | expandable

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | missing | missing |  |
| `expanded` | missing | missing |  |

## Accessibility

- Accessible name: missing

ARIA: The full text must remain available via tooltip, expansion or `title`; never truncate in the accessibility tree only.
Keyboard: An expand affordance is a focusable disclosure.

## Tokens

Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.

Consumes: `type.body.md`, `size.line-clamp`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding's custom properties; no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`).
  Fix: Replace with the role's custom property from the binding (see spec/bindings/html.yaml).

## Sources

- https://primer.style/components
- https://github.com/Shopify/polaris/tree/main/polaris-react/src/components
