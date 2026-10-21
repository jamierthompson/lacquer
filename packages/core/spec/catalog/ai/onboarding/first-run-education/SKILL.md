---
name: lacquer-first-run-education
description: A dismissible explanation of how the AI works that stays reachable, preferably delivered as the first message.
---

# First-run education

> A dismissible explanation of how the AI works that stays reachable, preferably delivered as the first message.
>
> component · ai/onboarding · tier 2 · established · status: draft

Also called: first assistant message, product tour, Sample response (Shape of AI).

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: enabled
- states.a11y: enabled
- modes.treatment: unseen, seen, dismissed
- modes.a11y: unseen, seen, dismissed
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: first session
- Use: after major changes (HAX G18)
- Avoid: multi-step modal tours that block use

Built from: `message`, `dialog`, `link`.

Pairs with: `capability-empty-state`, `data-use-notice`, `model-version-badge`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `one-time-first-message` |  | required | one-time first message or lightweight tour |
| `modes` |  | required | modes, memory, data use, feedback explained |
| `re-openable-from-help` |  | required | re-openable from Help |

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | missing | missing |  |

## Modes

Component-specific display modes. Same contract as states: a treatment and an a11y expression each.

| Mode | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `unseen` | missing | missing |  |
| `seen` | missing | missing |  |
| `dismissed` | missing | missing |  |

## API (framework-neutral)

Interactions:
- dismiss
- reopen

## Accessibility

- Accessible name: missing

Prefer a message over a modal; dismissible; no focus trap.

## Tokens

Roles, not values. A role is a token path in spec/tokens; the html binding reads it as `--lq-<role-with-dashes>`, the tailwind binding as an `lq-` utility (dist/bindings.json has both).

Consumes: `color.bg.surface-secondary`, `type.body.sm`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding (its custom properties or its utility classes); no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`, `bg-zinc-900`, `rounded-lg`).
  Fix: Replace with the role's `--lq-*` property or its `lq-` utility class; both are derived from the role's path in spec/tokens (see dist/bindings.json).

## Exemplars

- HAX G8 — support efficient dismissal

## Sources

- https://www.microsoft.com/en-us/haxtoolkit/library/
