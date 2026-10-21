---
name: lacquer-paragraph
description: A block of running prose with the system's reading measure and paragraph rhythm.
---

# Paragraph

> A block of running prose with the system's reading measure and paragraph rhythm.
>
> component · core/typography · tier 2 · atom · established · status: draft

Also called: P, Body copy, Typography.Paragraph, Lede.

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

- Use: Marketing copy, docs, model output rendered as prose
- Avoid: Single-line UI strings — use Text

Pairs with: `prose`, `heading`, `container`.

AI products rely on this.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `paragraph-block` |  | required | paragraph block |
| `leading` |  | required | leading |
| `bottom-margin` |  | required | bottom margin |

## Variants

- **variant**: default | lede | small
- **size**: sm | md | lg

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | missing | missing |  |

## Accessibility

- Accessible name: missing

ARIA: Native `p`.
Keyboard: None.

## Tokens

Roles, not values. A role is a token path in spec/tokens; the html binding reads it as `--lq-<role-with-dashes>`, the tailwind binding as an `lq-` utility (dist/bindings.json has both).

Consumes: `type.body.md`, `line-height.relaxed`, `space.stack.md`, `size.measure`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding (its custom properties or its utility classes); no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`, `bg-zinc-900`, `rounded-lg`).
  Fix: Replace with the role's `--lq-*` property or its `lq-` utility class; both are derived from the role's path in spec/tokens (see dist/bindings.json).

## Sources

- https://ant.design/components/overview/
- https://chakra-ui.com/docs/components/concepts/overview
