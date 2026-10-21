---
name: lacquer-portal
description: Renders children into a different DOM node so overlays escape overflow and stacking contexts.
---

# Portal

> Renders children into a different DOM node so overlays escape overflow and stacking contexts.
>
> component · core/utilities · tier 2 · primitive · established · status: draft

Also called: Teleport, PortalsManager, Layer, OverlayContainer.

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

- Use: Any dialog, popover, tooltip or toast
- Use: Parent has `overflow:hidden` or a transform
- Avoid: The overlay is genuinely inline and unclipped

Pairs with: `dialog`, `popover`, `toast`, `focus-trap`.

AI products rely on this.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `portal-root-node` |  | required | portal root node |
| `container-prop` |  | required | container prop |

## Variants

- **variant**: body | custom container

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | missing | missing |  |

## Accessibility

- Accessible name: missing

ARIA: Must preserve focus order and `aria-owns`/labelled relationships across the boundary.
Keyboard: Focus management is the caller's job — pair with focus-trap.

## Tokens

Roles, not values. A role is a token path in spec/tokens; the html binding reads it as `--lq-<role-with-dashes>`, the tailwind binding as an `lq-` utility (dist/bindings.json has both).

Consumes: `z.overlay`, `z.modal`, `z.toast`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding (its custom properties or its utility classes); no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`, `bg-zinc-900`, `rounded-lg`).
  Fix: Replace with the role's `--lq-*` property or its `lq-` utility class; both are derived from the role's path in spec/tokens (see dist/bindings.json).

## Sources

- https://www.radix-ui.com/primitives/docs/overview/introduction
- https://chakra-ui.com/docs/components/concepts/overview
