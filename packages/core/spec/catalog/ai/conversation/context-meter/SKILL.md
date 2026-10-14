---
name: lacquer-context-meter
description: Shows how much of the context window (and budget) a thread has used, with a breakdown on hover and a compaction action.
---

# Context / token meter

> Shows how much of the context window (and budget) a thread has used, with a breakdown on hover and a compaction action.
>
> component · ai/conversation · tier 2 · emerging · status: draft

Also called: Context (AI Elements), /context and status line (Claude Code), context indicator (Cursor), credits (Lovable), Cost estimates (Shape of AI).

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: warning
- states.a11y: warning
- modes.treatment: normal, full, unknown
- modes.a11y: normal, full, unknown
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: long agent sessions
- Use: developer tools
- Use: metered products
- Avoid: consumer chat where the number has no actionable meaning

Built from: `progress`, `hover-card`, `tooltip`.

Pairs with: `version-history`, `quota-notice`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `circular-progress-ring` |  | required | circular progress ring with percentage |
| `hover-breakdown` |  | required | hover breakdown: input, output, reasoning, cached tokens, cost |
| `warning-threshold` |  | required | warning threshold with action (summarize / new chat) |

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `warning` | missing | missing |  |

## Modes

Component-specific display modes. Same contract as states: a treatment and an a11y expression each.

| Mode | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `normal` | missing | missing |  |
| `full` | missing | missing |  |
| `unknown` | missing | missing |  |

## API (framework-neutral)

Interactions:
- hover for breakdown
- click to summarize/compact

## Accessibility

- Accessible name: missing

Progressbar semantics with value text; breakdown available on focus.

## Tokens

Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.

Consumes: `color.fg.muted`, `color.status.warning`, `type.label.sm`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding's custom properties; no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`).
  Fix: Replace with the role's custom property from the binding (see spec/bindings/html.yaml).

## Exemplars

- AI Elements Context — SVG ring with token and cost breakdown
- Claude Code /rewind — Summarize from here / up to here

## Sources

- https://elements.ai-sdk.dev/components/context
- https://code.claude.com/docs/en/checkpointing
