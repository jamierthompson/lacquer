---
name: lacquer-badge
description: A small count or status marker attached to another element.
---

# Badge

> A small count or status marker attached to another element.
>
> component · core/data-display · tier 1 · atom · established · status: draft

Also called: CounterLabel, Pill, Notification dot, Chip (static), Lozenge, Counter.

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

- Use: Unread counts, status on a row, version markers
- Avoid: The badge is the only carrier of critical information

Pairs with: `avatar`, `tabs`, `icon-button`, `list-view`.

AI products rely on this.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `container` |  | required | container |
| `label-or-count` |  | required | label or count |
| `dot-variant` |  | required | dot variant |
| `anchor-offset` |  | required | anchor/offset |

## Variants

- **variant**: neutral | info | success | warning | danger | dot | count | outline
- **size**: sm | md

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | missing | missing |  |

## Accessibility

- Accessible name: missing

ARIA: Not interactive; the count must be included in the host control's accessible name (e.g. 'Inbox, 3 unread').
Keyboard: None.

## Tokens

Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.

Consumes: `radius.pill`, `type.label.sm`, `color.bg.danger`, `color.fg.on-danger`, `space.inset.2xs`.

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
