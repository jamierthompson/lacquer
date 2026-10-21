---
name: lacquer-quota-notice
description: Honest quota communication: facts, reset time, alternatives, no fake urgency.
---

# Rate limit / quota notice

> Honest quota communication: facts, reset time, alternatives, no fake urgency.
>
> component · ai/conversation · tier 2 · established · status: draft

Also called: usage limit banner (ChatGPT, Claude), credits (Lovable, v0), Cost estimates (Shape of AI).

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: enabled
- states.a11y: enabled
- modes.treatment: approaching, reached, reset
- modes.a11y: approaching, reached, reset
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: metered products
- Avoid: countdown theatre or manufactured scarcity

Built from: `alert`, `progress`, `button`.

Pairs with: `context-meter`, `model-mode-selector`, `anti-dark-patterns`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `banner-or-inline` |  | required | banner or inline notice |
| `what-is-limited` |  | required | what is limited and when it resets |
| `alternative` |  | required | alternative (smaller model, wait, upgrade) |
| `usage-meter` |  | required | usage meter in settings |

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | missing | missing |  |

## Modes

Component-specific display modes. Same contract as states: a treatment and an a11y expression each.

| Mode | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `approaching` | missing | missing |  |
| `reached` | missing | missing |  |
| `reset` | missing | missing |  |

## API (framework-neutral)

Interactions:
- dismiss
- switch model
- upgrade

## Accessibility

- Accessible name: missing

Status region; send disabled state announced; draft preserved.

## Tokens

Roles, not values. A role is a token path in spec/tokens; the html binding reads it as `--lq-<role-with-dashes>`, the tailwind binding as an `lq-` utility (dist/bindings.json has both).

Consumes: `color.status.warning`, `color.bg.surface-secondary`, `type.body.sm`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding (its custom properties or its utility classes); no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`, `bg-zinc-900`, `rounded-lg`).
  Fix: Replace with the role's `--lq-*` property or its `lq-` utility class; both are derived from the role's path in spec/tokens (see dist/bindings.json).

## Exemplars

- Claude/ChatGPT — usage limit notices with reset time
- Lovable — credits and usage docs

## Sources

- https://docs.lovable.dev/llms.txt
