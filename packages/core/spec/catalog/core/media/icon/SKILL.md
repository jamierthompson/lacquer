---
name: lacquer-icon
description: A vector glyph carrying meaning or decoration inside other components.
---

# Icon

> A vector glyph carrying meaning or decoration inside other components.
>
> component · core/media · tier 1 · atom · established · status: draft

Also called: Glyph, SVG icon, ThemeIcon, Symbol, Material Symbols.

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: enabled, disabled
- states.a11y: enabled, disabled
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: Reinforcing labels, denoting status, compressing toolbars
- Avoid: The icon is the sole label for an uncommon action

Pairs with: `icon-button`, `button`, `tag`, `list-view`.

AI products rely on this.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `svg` |  | required | svg |
| `viewbox` |  | required | viewBox |
| `currentcolor-fill` |  | required | currentColor fill |
| `optional-title` |  | required | optional title |

## Variants

- **variant**: outline | filled | duotone | decorative | semantic
- **size**: xs | sm | md | lg | xl

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | missing | missing |  |
| `disabled` | missing | missing |  |

## Accessibility

- Accessible name: missing

ARIA: Decorative icons need `aria-hidden="true"`; meaningful ones need `role="img"` and a title or label.
Keyboard: None.

## Tokens

Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.

Consumes: `size.icon.md`, `color.fg.default`, `color.fg.muted`, `stroke.width.icon`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding's custom properties; no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`).
  Fix: Replace with the role's custom property from the binding (see spec/bindings/html.yaml).

## Sources

- https://m3.material.io/components
- https://carbondesignsystem.com/components/overview/components/
