---
name: lacquer-model-version-badge
description: Answers 'which model wrote this' and notifies users when the default changes.
---

# Model / version badge

> Answers 'which model wrote this' and notifies users when the default changes.
>
> component · ai/trust · tier 3 · emerging · status: draft

Also called: model label on responses, model name in header, HAX G18 change notice.

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: enabled
- states.a11y: enabled
- modes.treatment: default, changed-mid-thread, deprecated
- modes.a11y: default, changed-mid-thread, deprecated
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: multi-model products
- Use: after model migrations
- Avoid: single fixed model

Built from: `badge`, `link`, `toast`.

Pairs with: `model-mode-selector`, `first-run-education`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `small-non-interactive-label` |  | required | small non-interactive label (model name) |
| `link-to-selector` |  | required | link to selector |
| `changelog-notice-when` |  | required | changelog/notice when the default model changes |

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | missing | missing |  |

## Modes

Component-specific display modes. Same contract as states: a treatment and an a11y expression each.

| Mode | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `default` | missing | missing |  |
| `changed-mid-thread` | missing | missing |  |
| `deprecated` | missing | missing |  |

## API (framework-neutral)

Interactions:
- click opens selector or changelog

## Accessibility

- Accessible name: missing

Text label; change announced once.

## Tokens

Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.

Consumes: `color.fg.muted`, `type.label.sm`, `radius.sm`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding's custom properties; no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`).
  Fix: Replace with the role's custom property from the binding (see spec/bindings/html.yaml).

## Exemplars

- HAX G18 — Notify users about changes

## Sources

- https://www.microsoft.com/en-us/haxtoolkit/library/
