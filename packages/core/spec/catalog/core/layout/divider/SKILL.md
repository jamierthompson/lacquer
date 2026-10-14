---
name: lacquer-divider
description: Thin rule that separates content groups either visually or semantically.
---

# Divider

> Thin rule that separates content groups either visually or semantically.
>
> component · core/layout · tier 2 · atom · established · status: draft

Also called: Separator, hr, Vertical rule, Rule.

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

- Use: Grouping menu sections or list segments
- Use: Separating a card header from its body
- Avoid: Whitespace already communicates the grouping

Pairs with: `dropdown-menu`, `card`, `stack`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `line` |  | required | line |
| `optional-inset` |  | required | optional inset |
| `optional-label-slot` |  | required | optional label slot |

## Variants

- **variant**: horizontal | vertical | with-label | inset

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | missing | missing |  |

## Accessibility

- Accessible name: missing

ARIA: `role="separator"`; decorative dividers use `aria-hidden` or `role="none"`.
Keyboard: None (non-focusable separators only).

## Tokens

Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.

Consumes: `color.border.subtle`, `space.stack.md`, `size.border.thin`.

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
- https://github.com/Shopify/polaris/tree/main/polaris-react/src/components
