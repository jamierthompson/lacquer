---
name: lacquer-smart-autofill
description: AI-proposed field values that look provisional until confirmed and can always be reverted.
---

# Smart autocomplete and auto-fill

> AI-proposed field values that look provisional until confirmed and can always be reverted.
>
> component · ai/augmentation · tier 2 · established · status: draft

Also called: Auto-fill (Shape of AI; Notion database autofill), Smart Compose, AI-labelled form fields (Carbon).

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: enabled
- states.a11y: enabled
- modes.treatment: suggested, accepted, overridden, confirmed
- modes.a11y: suggested, accepted, overridden, confirmed
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: forms and databases with predictable fields
- Avoid: silently committing AI values

Built from: `text-input`, `textarea`, `badge`, `button`.

Pairs with: `ghost-text-completion`, `ai-label`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `ghost-text` |  | required | ghost text in fields |
| `pre-filled-values` |  | required | pre-filled values with AI label |
| `revert-control-per` |  | required | revert control per field |
| `confirm-apply-all` |  | required | confirm/apply all |

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | missing | missing |  |

## Modes

Component-specific display modes. Same contract as states: a treatment and an a11y expression each.

| Mode | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `suggested` | missing | missing |  |
| `accepted` | missing | missing |  |
| `overridden` | missing | missing | overridden (revert shown) |
| `confirmed` | missing | missing |  |

## API (framework-neutral)

Interactions:
- Tab accepts
- edit overrides
- revert restores AI value

## Accessibility

- Accessible name: missing

Suggested values announced as suggestions; distinct visual state until confirmed; revert is a button.

## Tokens

Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.

Consumes: `color.fg.ghost`, `color.border.ai`, `color.accent.ai-subtle`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding's custom properties; no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`).
  Fix: Replace with the role's custom property from the binding (see spec/bindings/html.yaml).

## Exemplars

- Carbon — revert button replaces the AI label after override

## Sources

- https://carbondesignsystem.com/components/ai-label/usage/
