---
name: lacquer-heading
description: Titles a section and establishes the document outline.
---

# Heading

> Titles a section and establishes the document outline.
>
> component · core/typography · tier 1 · atom · established · status: draft

Also called: Title, Typography.Title, Text as=h1, Display.

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

- Use: Every section that a user could plausibly navigate to
- Avoid: You only want big text — use Text with a display size

Pairs with: `text`, `page-header`, `prose`.

AI products rely on this.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `heading-text` |  | required | heading text |
| `optional-eyebrow` |  | required | optional eyebrow |
| `optional-trailing-actions` |  | required | optional trailing actions |

## Variants

- **variant**: display | page-title | section | subsection
- **size**: xs | sm | md | lg | xl | 2xl

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | missing | missing |  |

## Accessibility

- Accessible name: missing

ARIA: Native `h1`–`h6`; visual size must be decoupled from semantic level.
Keyboard: Screen-reader users navigate by heading level, so levels must not skip.

## Tokens

Roles, not values. A role is a token path in spec/tokens; the html binding reads it as `--lq-<role-with-dashes>`, the tailwind binding as an `lq-` utility (dist/bindings.json has both).

Consumes: `type.heading.lg`, `type.heading.md`, `color.fg.default`, `space.stack.sm`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding (its custom properties or its utility classes); no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`, `bg-zinc-900`, `rounded-lg`).
  Fix: Replace with the role's `--lq-*` property or its `lq-` utility class; both are derived from the role's path in spec/tokens (see dist/bindings.json).

## Sources

- https://primer.style/components
- https://atlassian.design/components
