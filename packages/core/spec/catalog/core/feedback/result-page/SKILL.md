---
name: lacquer-result-page
description: Full-page outcome screen for success, error, empty, offline or permission states.
---

# Result Page

> Full-page outcome screen for success, error, empty, offline or permission states.
>
> component · core/feedback · tier 2 · template · established · status: draft

Also called: Status page, Result, 404 page, Error page, Success screen, Confirmation panel.

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: enabled, success, invalid, empty
- states.a11y: enabled, success, invalid, empty
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: Checkout confirmation, unrecoverable errors, offline mode
- Avoid: The user could stay in context — use an inline alert

Pairs with: `empty-state`, `alert`, `button`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `illustration-or-status` |  | required | illustration or status icon |
| `heading` |  | required | heading |
| `explanation` |  | required | explanation |
| `error-code-id` |  | required | error code/id |
| `primary-action` |  | required | primary action |
| `secondary-action` |  | required | secondary action |
| `support-link` |  | required | support link |

## Variants

- **variant**: success | error | 404 | 500 | 403 | offline | maintenance

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | missing | missing |  |
| `success` | missing | missing |  |
| `invalid` | missing | missing |  |
| `empty` | missing | missing |  |

## Accessibility

- Accessible name: missing

ARIA: Page title and `h1` must state the outcome; move focus to the heading on route change.
Keyboard: Actions are ordinary focusable controls.

## Tokens

Roles, not values. A role is a token path in spec/tokens; the html binding reads it as `--lq-<role-with-dashes>`, the tailwind binding as an `lq-` utility (dist/bindings.json has both).

Consumes: `space.inset.lg`, `type.heading.md`, `color.fg.muted`, `size.illustration.lg`.

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
- https://design-system.service.gov.uk/components/
