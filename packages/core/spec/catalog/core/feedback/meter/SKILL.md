---
name: lacquer-meter
description: Displays a static measurement inside a known range, such as quota or storage used.
---

# Meter

> Displays a static measurement inside a known range, such as quota or storage used.
>
> component · core/feedback · tier 3 · atom · established · status: draft

Also called: Gauge, MeterGroup, Usage bar, Capacity indicator.

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: enabled, success, warning, invalid
- states.a11y: enabled, success, warning, invalid
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: Storage, credits, rate limits, password strength, token budgets
- Avoid: The value is progress toward completion — use Progress

Pairs with: `stat`, `alert`, `card`.

AI products rely on this.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `track` |  | required | track |
| `fill` |  | required | fill |
| `threshold-markers` |  | required | threshold markers |
| `value-label` |  | required | value label |
| `legend` |  | required | legend |

## Variants

- **variant**: linear | circular | segmented | with-thresholds
- **size**: sm | md | lg

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | missing | missing |  |
| `success` | missing | missing |  |
| `warning` | missing | missing |  |
| `invalid` | missing | missing |  |

## Accessibility

- APG pattern: [Meter](https://www.w3.org/WAI/ARIA/apg/patterns/meter/)
- Accessible name: missing

ARIA: `role="meter"` with `aria-valuenow/min/max` and `aria-valuetext`; distinct from progressbar.
Keyboard: Not focusable.

## Tokens

Roles, not values. A role is a token path in spec/tokens; the html binding reads it as `--lq-<role-with-dashes>`, the tailwind binding as an `lq-` utility (dist/bindings.json has both).

Consumes: `radius.pill`, `color.bg.success`, `color.bg.warning`, `color.bg.danger`, `size.progress.height`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding (its custom properties or its utility classes); no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`, `bg-zinc-900`, `rounded-lg`).
  Fix: Replace with the role's `--lq-*` property or its `lq-` utility class; both are derived from the role's path in spec/tokens (see dist/bindings.json).

## Sources

- https://www.w3.org/WAI/ARIA/apg/patterns/meter/
- https://base-ui.com/react/overview/quick-start
- https://opensource.adobe.com/spectrum-design-data/components
