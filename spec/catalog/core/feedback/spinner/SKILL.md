---
name: lacquer-spinner
description: Indeterminate activity indicator for short waits.
---

# Spinner

> Indeterminate activity indicator for short waits.
>
> component · core/feedback · tier 1 · atom · established · status: draft

Also called: Loader, Loading indicator, ProgressSpinner, Activity indicator, Busy indicator, Spin.

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: enabled, loading
- states.a11y: enabled, loading
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: Waits under about one second where layout is unknown
- Avoid: The shape of the incoming content is known — a skeleton reduces perceived wait

Pairs with: `button`, `skeleton`, `loading-overlay`.

AI products rely on this.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `animated-glyph` |  | required | animated glyph |
| `optional-label` |  | required | optional label |
| `size-variants` |  | required | size variants |

## Variants

- **variant**: inline | centred | in-button | with-label | overlay
- **size**: xs | sm | md | lg

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | missing | missing |  |
| `loading` | missing | missing |  |

## Accessibility

- Accessible name: missing

ARIA: `role="status"` with an accessible name such as 'Loading'; set `aria-busy` on the region it covers.
Keyboard: Not focusable; focus must not be lost while it is shown.

## Tokens

Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.

Consumes: `size.icon.md`, `color.fg.accent`, `motion.duration.spin`, `stroke.width.icon`.

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
