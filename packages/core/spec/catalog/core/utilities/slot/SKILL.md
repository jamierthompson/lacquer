---
name: lacquer-slot
description: Composition primitive that merges a component's behaviour and props onto a child element.
---

# Slot

> Composition primitive that merges a component's behaviour and props onto a child element.
>
> component · core/utilities · tier 2 · primitive · established · status: draft

Also called: asChild, Slot, useRender, Polymorphic as, render prop, Pressable.

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

- Use: Rendering a Button as a Link, or a trigger as an arbitrary element
- Avoid: It would produce invalid nesting such as a button inside a button

Pairs with: `button`, `link`, `box`.

AI products rely on this.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `slot-wrapper` |  | required | slot wrapper |
| `prop-merge-strategy` |  | required | prop merge strategy |
| `ref-forwarding` |  | required | ref forwarding |
| `event-composition` |  | required | event composition |

## Variants

- **variant**: asChild | as-prop | render-function

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | missing | missing |  |

## Accessibility

- Accessible name: missing

ARIA: Must forward ARIA attributes and refs, or the merged element loses its semantics.
Keyboard: Inherits from the element it renders as.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding's custom properties; no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`).
  Fix: Replace with the role's custom property from the binding (see spec/bindings/html.yaml).

## Sources

- https://www.radix-ui.com/primitives/docs/overview/introduction
- https://base-ui.com/react/overview/quick-start
