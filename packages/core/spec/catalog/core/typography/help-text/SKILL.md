---
name: lacquer-help-text
description: Short supporting copy under a control that explains format, constraints or consequences.
---

# Help Text

> Short supporting copy under a control that explains format, constraints or consequences.
>
> component · core/typography · tier 1 · atom · established · status: draft

Also called: Description, Hint, Supporting text, Caption, FormControl.Caption, Helper text.

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: enabled, invalid, success, warning, disabled
- states.a11y: enabled, invalid, success, warning, disabled
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: Format is non-obvious
- Use: You would otherwise rely on an error to teach the rule
- Avoid: The label alone is sufficient — noise costs attention

Pairs with: `field`, `label`, `text-input`.

AI products rely on this.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `description-text` |  | required | description text |
| `optional-character-counter` |  | required | optional character counter |
| `optional-link` |  | required | optional link |

## Variants

- **variant**: neutral | error | success | warning
- **size**: sm

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | missing | missing |  |
| `invalid` | missing | missing |  |
| `success` | missing | missing |  |
| `warning` | missing | missing |  |
| `disabled` | missing | missing |  |

## Accessibility

- Accessible name: missing

ARIA: Referenced by the control's `aria-describedby`; error copy also drives `aria-invalid`.
Keyboard: None.

## Tokens

Roles, not values. A role is a token path in spec/tokens; the html binding reads it as `--lq-<role-with-dashes>`, the tailwind binding as an `lq-` utility (dist/bindings.json has both).

Consumes: `type.body.sm`, `color.fg.muted`, `color.fg.danger`, `space.stack.xs`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding (its custom properties or its utility classes); no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`, `bg-zinc-900`, `rounded-lg`).
  Fix: Replace with the role's `--lq-*` property or its `lq-` utility class; both are derived from the role's path in spec/tokens (see dist/bindings.json).

## Sources

- https://opensource.adobe.com/spectrum-design-data/components
- https://m3.material.io/components
