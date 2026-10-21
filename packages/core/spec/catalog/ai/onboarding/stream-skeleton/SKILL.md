---
name: lacquer-stream-skeleton
description: Use skeletons only when the output's shape is known; for prose use the thinking indicator instead.
---

# Skeletons for streamed structured output

> Use skeletons only when the output's shape is known; for prose use the thinking indicator instead.
>
> component · ai/onboarding · tier 2 · emerging · status: draft

Also called: Shimmer (AI Elements), per-cell skeletons in variation grids, artifact panel skeleton.

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: skeleton, filled
- states.a11y: skeleton, filled
- modes.treatment: partially-filled
- modes.a11y: partially-filled
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: tables, grids, panels being generated
- Avoid: fake paragraph skeletons for prose

Built from: `skeleton`.

Pairs with: `thinking-indicator`, `variation-grid`, `generation-progress`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `shape-matched-skeletons` |  | required | shape-matched skeletons for known structures (table, card grid, panel) |
| `progressive-replacement-as` |  | required | progressive replacement as parts arrive |

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `skeleton` | missing | missing |  |
| `filled` | missing | missing |  |

## Modes

Component-specific display modes. Same contract as states: a treatment and an a11y expression each.

| Mode | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `partially-filled` | missing | missing |  |

## API (framework-neutral)

Interactions:
- none

## Accessibility

- Accessible name: missing

aria-busy on the container; no announcements for skeletons themselves.

## Tokens

Roles, not values. A role is a token path in spec/tokens; the html binding reads it as `--lq-<role-with-dashes>`, the tailwind binding as an `lq-` utility (dist/bindings.json has both).

Consumes: `color.bg.skeleton`, `shimmer.duration`, `radius.md`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding (its custom properties or its utility classes); no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`, `bg-zinc-900`, `rounded-lg`).
  Fix: Replace with the role's `--lq-*` property or its `lq-` utility class; both are derived from the role's path in spec/tokens (see dist/bindings.json).

## Exemplars

- AI Elements Plan — streaming shimmer loading states

## Sources

- https://elements.ai-sdk.dev/components/plan
