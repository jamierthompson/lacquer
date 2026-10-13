---
name: lacquer-button-group
description: Visually joins related buttons into one unit and defines their order of importance.
---

# Button Group

> Visually joins related buttons into one unit and defines their order of importance.
>
> component · core/actions · tier 2 · molecule · established · status: draft

Also called: ButtonGroup, Action group, Space.Compact, Segmented buttons, Btn-group.

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

- Use: Save / Save and continue / Cancel rows
- Use: Paired primary and secondary actions
- Avoid: The buttons are mutually exclusive options — use Segmented Control

Pairs with: `button`, `split-button`, `toolbar`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `group-container` |  | required | group container |
| `child-buttons` |  | required | child buttons |
| `shared-borders` |  | required | shared borders |
| `overflow-menu` |  | required | overflow menu |

## Variants

- **variant**: attached | spaced | vertical | with-overflow
- **size**: sm | md | lg

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | missing | missing |  |
| `disabled` | missing | missing |  |

## Accessibility

- APG pattern: [Toolbar](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/)
- Accessible name: missing

ARIA: `role="group"` with `aria-label`; use Toolbar semantics if arrow-key navigation is provided.
Keyboard: Tab reaches each button by default; Toolbar pattern uses roving tabindex instead.

## Tokens

Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.

Consumes: `radius.control`, `space.gap.xs`, `color.border.default`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding's custom properties; no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`).
  Fix: Replace with the role's custom property from the binding (see spec/bindings/html.yaml).

## Sources

- https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/
- https://m3.material.io/components
- https://github.com/Shopify/polaris/tree/main/polaris-react/src/components
