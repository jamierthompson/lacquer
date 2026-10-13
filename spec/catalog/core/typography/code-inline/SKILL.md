---
name: lacquer-code-inline
description: Marks a short code token inside running text.
---

# Inline Code

> Marks a short code token inside running text.
>
> component · core/typography · tier 2 · atom · established · status: draft

Also called: Code, InlineCode, kbd-adjacent, Mono.

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

- Use: File names, flags, identifiers inside a sentence
- Avoid: Multi-line snippets — use a code block

Pairs with: `code-block`, `prose`, `kbd`.

AI products rely on this.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `mono-text` |  | required | mono text |
| `subtle-background` |  | required | subtle background |
| `padding` |  | required | padding |

## Variants

- **variant**: default | subtle | danger
- **size**: sm | md

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | missing | missing |  |

## Accessibility

- Accessible name: missing

ARIA: Native `code`.
Keyboard: None.

## Tokens

Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.

Consumes: `type.code.sm`, `color.bg.subtle`, `radius.control`, `space.inset.2xs`, `color.fg.default`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding's custom properties; no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`).
  Fix: Replace with the role's custom property from the binding (see spec/bindings/html.yaml).

## Sources

- https://atlassian.design/components
- https://chakra-ui.com/docs/components/concepts/overview
