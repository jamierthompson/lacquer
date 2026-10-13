---
name: lacquer-progress
description: Shows how much of a task is complete, as a bar or a ring.
---

# Progress

> Shows how much of a task is complete, as a bar or a ring.
>
> component · core/feedback · tier 2 · atom · established · status: draft

Also called: ProgressBar, Progress ring, ProgressCircle, Loading bar, RingProgress, Meter (progress).

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: enabled, loading, success, invalid, indeterminate
- states.a11y: enabled, loading, success, invalid, indeterminate
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: Uploads, imports, multi-step generation, quota usage
- Avoid: Duration is unknown and short — a spinner is honest
- Avoid: It never actually advances

Pairs with: `file-upload`, `spinner`, `stepper`, `toast`.

AI products rely on this.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `track` |  | required | track |
| `indicator` |  | required | indicator |
| `value-label` |  | required | value label |
| `helper-text` |  | required | helper text |
| `buffer-segment` |  | required | buffer segment |

## Variants

- **variant**: determinate | indeterminate | linear | circular | segmented | with-label
- **size**: sm | md | lg

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | missing | missing |  |
| `loading` | missing | missing |  |
| `success` | missing | missing |  |
| `invalid` | missing | missing |  |
| `indeterminate` | missing | missing |  |

## Accessibility

- Accessible name: missing

ARIA: `role="progressbar"` with `aria-valuenow/min/max`; omit `aria-valuenow` when indeterminate.
Keyboard: Not focusable; progress must also be announced politely at meaningful intervals.

## Tokens

Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.

Consumes: `radius.pill`, `color.bg.primary`, `color.bg.subtle`, `size.progress.height`, `motion.duration.base`.

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
