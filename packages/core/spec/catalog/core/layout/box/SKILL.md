---
name: lacquer-box
description: Styled generic container that maps style props to design tokens; the escape hatch every other primitive is built on.
---

# Box

> Styled generic container that maps style props to design tokens; the escape hatch every other primitive is built on.
>
> component · core/layout · tier 2 · primitive · established · status: draft

Also called: View, Paper, Surface, Frame, Primitive, div.

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

- Use: You need a one-off container that still consumes tokens
- Use: Building a new component's root node
- Avoid: A semantic element (section, nav, ul) is the honest answer
- Avoid: It would let arbitrary CSS bypass the token layer

Pairs with: `stack`, `flex`, `grid`.

AI products rely on this.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `root-element` |  | required | root element |
| `polymorphic-as-aschild-slot` |  | required | polymorphic `as`/`asChild` slot |

## Variants

- **variant**: surface | transparent | bordered

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | missing | missing |  |

## Accessibility

- Accessible name: missing

ARIA: No implicit role; renders whatever element `as` specifies.
Keyboard: None (non-interactive by default).

## Tokens

Roles, not values. A role is a token path in spec/tokens; the html binding reads it as `--lq-<role-with-dashes>`, the tailwind binding as an `lq-` utility (dist/bindings.json has both).

Consumes: `space.inset.md`, `radius.surface`, `color.bg.surface`, `color.border.subtle`, `shadow.sm`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding (its custom properties or its utility classes); no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`, `bg-zinc-900`, `rounded-lg`).
  Fix: Replace with the role's `--lq-*` property or its `lq-` utility class; both are derived from the role's path in spec/tokens (see dist/bindings.json).

## Sources

- https://github.com/Shopify/polaris/tree/main/polaris-react/src/components
- https://atlassian.design/components
