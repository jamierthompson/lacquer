---
name: lacquer-loading-overlay
description: Dims and blocks a region while an operation completes.
---

# Loading Overlay

> Dims and blocks a region while an operation completes.
>
> component · core/feedback · tier 2 · molecule · established · status: draft

Also called: Backdrop, BlockUI, Busy overlay, Loading mask, Blanket.

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: loading, enabled
- states.a11y: loading, enabled
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: Saving a form, refreshing a table, blocking double-submit
- Avoid: A button-level loading state would suffice

Pairs with: `spinner`, `progress`, `form`.

AI products rely on this.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `scrim` |  | required | scrim |
| `spinner-or-progress` |  | required | spinner or progress |
| `message` |  | required | message |
| `cancel-action` |  | required | cancel action |
| `blocked-region` |  | required | blocked region |

## Variants

- **variant**: region | full-page | transparent | with-cancel

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `loading` | missing | missing |  |
| `enabled` | missing | missing |  |

## Accessibility

- Accessible name: missing

ARIA: Set `aria-busy="true"` on the blocked region and prevent focus from entering it (`inert`).
Keyboard: Focus must be blocked from the covered region; a cancel control stays reachable.

## Tokens

Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.

Consumes: `color.bg.scrim`, `z.overlay`, `motion.duration.fast`, `color.fg.default`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding's custom properties; no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`).
  Fix: Replace with the role's custom property from the binding (see spec/bindings/html.yaml).

## Sources

- https://mantine.dev/core/package/
- https://mui.com/material-ui/all-components/
