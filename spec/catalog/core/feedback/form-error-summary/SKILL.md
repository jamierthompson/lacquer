---
name: lacquer-form-error-summary
description: A single block at the top of a form listing every validation failure with links to each field.
---

# Error Summary

> A single block at the top of a form listing every validation failure with links to each field.
>
> component · core/feedback · tier 2 · organism · established · status: draft

Also called: Error summary, Validation summary, InlineError list, Form errors.

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: enabled, invalid
- states.a11y: enabled, invalid
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: Forms longer than one screen
- Use: Government or regulated services
- Avoid: A one-field form — inline errors suffice

Pairs with: `form`, `field`, `alert`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `container` |  | required | container |
| `heading` |  | required | heading |
| `error-list` |  | required | error list |
| `anchor-links` |  | required | anchor links to fields |
| `count` |  | required | count |

## Variants

- **variant**: error | warning

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | missing | missing |  |
| `invalid` | missing | missing |  |

## Accessibility

- Accessible name: missing

ARIA: `role="alert"` or a focused container with `tabindex="-1"`; move focus here on failed submit.
Keyboard: Each entry is a link that moves focus to the offending field.

## Tokens

Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.

Consumes: `color.bg.danger-subtle`, `color.border.danger`, `radius.surface`, `space.inset.md`, `type.label.md`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding's custom properties; no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`).
  Fix: Replace with the role's custom property from the binding (see spec/bindings/html.yaml).

## Sources

- https://design-system.service.gov.uk/components/
- https://designsystem.digital.gov/components/overview/
