---
name: lacquer-label
description: Names a form control and forms the click/announce association with it.
---

# Label

> Names a form control and forms the click/announce association with it.
>
> component · core/typography · tier 1 · atom · established · status: draft

Also called: FormLabel, Field.Label, Field label, Labelled.

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: enabled, disabled, invalid, read-only
- states.a11y: enabled, disabled, invalid, read-only
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: Every single form control, without exception
- Avoid: Never — if the label must be invisible, use visually-hidden, not omission

Pairs with: `field`, `text-input`, `help-text`.

AI products rely on this.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `label-text` |  | required | label text |
| `required-optional-indicator` |  | required | required/optional indicator |
| `optional-tooltip-trigger` |  | required | optional tooltip trigger |

## Variants

- **variant**: above | inline | floating | hidden
- **size**: sm | md

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | missing | missing |  |
| `disabled` | missing | missing |  |
| `invalid` | missing | missing |  |
| `read-only` | missing | missing |  |

## Accessibility

- Accessible name: missing

ARIA: Native `label[for]`, or `aria-labelledby`. Placeholder text is never a label.
Keyboard: Clicking the label focuses/toggles the control.

## Tokens

Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.

Consumes: `type.label.md`, `color.fg.default`, `space.stack.xs`, `color.fg.danger`.

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
- https://ui.shadcn.com/docs/components
