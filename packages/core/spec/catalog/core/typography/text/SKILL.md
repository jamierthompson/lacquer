---
name: lacquer-text
description: The general-purpose typographic primitive for body, label and caption copy.
---

# Text

> The general-purpose typographic primitive for body, label and caption copy.
>
> component · core/typography · tier 1 · atom · established · status: draft

Also called: Typography, Body, Paragraph, Span, Label text.

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

- Use: Any run of copy that should obey the type scale
- Avoid: The content is a heading, label or link with its own semantics

Pairs with: `heading`, `help-text`, `truncate`.

AI products rely on this.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `text-node` |  | required | text node |
| `optional-truncation` |  | required | optional truncation |
| `optional-emphasis-marks` |  | required | optional emphasis marks |

## Variants

- **variant**: body | secondary | caption | code | strong | emphasis | success | danger
- **size**: xs | sm | md | lg

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | missing | missing |  |

## Accessibility

- Accessible name: missing

ARIA: Semantic element chosen by `as`; colour alone must never carry meaning.
Keyboard: None.

## Tokens

Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.

Consumes: `type.body.md`, `type.body.sm`, `color.fg.default`, `color.fg.muted`, `line-height.body`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding's custom properties; no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`).
  Fix: Replace with the role's custom property from the binding (see spec/bindings/html.yaml).

## Sources

- https://primer.style/components
- https://atlassian.design/components
