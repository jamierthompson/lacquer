---
name: lacquer-blockquote
description: Sets off quoted material with an accent rule and optional attribution.
---

# Blockquote

> Sets off quoted material with an accent rule and optional attribution.
>
> component · core/typography · tier 3 · molecule · established · status: draft

Also called: Quote, Pull quote, Inset text.

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

- Use: Quoted source material, testimonials, cited passages in model answers
- Avoid: You just want an indented callout — use Alert

Pairs with: `prose`, `alert`, `text`.

AI products rely on this.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `quote-body` |  | required | quote body |
| `accent-border` |  | required | accent border |
| `citation-footer` |  | required | citation/footer |

## Variants

- **variant**: default | accent | pull-quote
- **size**: sm | md

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | missing | missing |  |

## Accessibility

- Accessible name: missing

ARIA: Native `blockquote` with `cite`; attribution in a `figcaption` when using `figure`.
Keyboard: None.

## Tokens

Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.

Consumes: `type.body.lg`, `color.border.accent`, `space.inset.md`, `color.fg.muted`.

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
