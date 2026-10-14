---
name: lacquer-list
description: Ordered or unordered prose list with token-controlled markers and spacing.
---

# List

> Ordered or unordered prose list with token-controlled markers and spacing.
>
> component · core/typography · tier 2 · molecule · established · status: draft

Also called: ul/ol, Bulleted list, Icon list, Typography list.

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

- Use: Enumerations inside prose or model output
- Avoid: Items are interactive rows — use List View or Menu

Pairs with: `prose`, `list-view`, `paragraph`.

AI products rely on this.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `list-root` |  | required | list root |
| `list-items` |  | required | list items |
| `marker` |  | required | marker |
| `nested-list` |  | required | nested list |

## Variants

- **variant**: unordered | ordered | unstyled | icon | inline | description
- **size**: sm | md

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | missing | missing |  |

## Accessibility

- Accessible name: missing

ARIA: Native `ul`/`ol`/`li`; do not strip list semantics with `list-style:none` alone in Safari without `role="list"`.
Keyboard: None.

## Tokens

Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.

Consumes: `space.stack.xs`, `space.inset.list`, `type.body.md`, `color.fg.default`.

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
