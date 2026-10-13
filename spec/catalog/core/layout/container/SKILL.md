---
name: lacquer-container
description: Centered content well that caps measure and applies responsive page gutters.
---

# Container

> Centered content well that caps measure and applies responsive page gutters.
>
> component · core/layout · tier 2 · primitive · established · status: draft

Also called: Page, Wrapper, Content well, grid-container.

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

- Use: Every page shell
- Use: Long-form reading columns needing a 60–80ch measure
- Avoid: Inside an already-constrained region — double gutters result

Pairs with: `app-header`, `footer`, `prose`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `outer-full-bleed-element` |  | required | outer full-bleed element |
| `max-width-inner` |  | required | max-width inner |
| `horizontal-gutters` |  | required | horizontal gutters |

## Variants

- **variant**: narrow | default | wide | fluid
- **size**: sm | md | lg | xl | full

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | missing | missing |  |

## Accessibility

- Accessible name: missing

ARIA: None; often wraps a `main` landmark.
Keyboard: None.

## Tokens

Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.

Consumes: `size.container.md`, `space.inset.page`, `breakpoint.md`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding's custom properties; no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`).
  Fix: Replace with the role's custom property from the binding (see spec/bindings/html.yaml).

## Sources

- https://chakra-ui.com/docs/components/concepts/overview
- https://mantine.dev/core/package/
