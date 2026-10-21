---
name: lacquer-generate-button
description: The entry point for AI in augmented products: a verb-labelled button, optionally with a brand glyph; never a bare sparkle.
---

# Generate button (and the sparkle convention)

> The entry point for AI in augmented products: a verb-labelled button, optionally with a brand glyph; never a bare sparkle.
>
> component · ai/generation · tier 1 · established · status: draft

Also called: Initial CTA (Shape of AI), Generate / Write with AI / Ask AI / Magic Write / Make, Actions (Figma toolbar).

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: idle, error
- states.a11y: idle, error
- modes.treatment: generating, done
- modes.a11y: generating, done
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: any AI feature entry point
- Avoid: sparkle-only icon buttons
- Avoid: using sparkles for suggestions, favourites or 'new'

Built from: `button`, `dropdown-menu`, `icon`.

Pairs with: `selection-ai-menu`, `ai-label`, `ai-accent-token`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `button-with-icon` |  | required | button with icon + verb label |
| `optional-dropdown` |  | required | optional dropdown of presets |
| `opens-prompt-affordance` |  | required | opens prompt affordance or runs preset |
| `result-appears` |  | required | result appears in a reviewable slot |

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `idle` | missing | missing |  |
| `error` | missing | missing |  |

## Modes

Component-specific display modes. Same contract as states: a treatment and an a11y expression each.

| Mode | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `generating` | missing | missing | generating (spinner/shimmer, becomes stop) |
| `done` | missing | missing |  |

## API (framework-neutral)

Interactions:
- click to generate
- click again to stop
- menu for presets

## Accessibility

- Accessible name: missing

Named by its verb, never by an icon alone; busy state announced.

## Tokens

Roles, not values. A role is a token path in spec/tokens; the html binding reads it as `--lq-<role-with-dashes>`, the tailwind binding as an `lq-` utility (dist/bindings.json has both).

Consumes: `color.accent.brand`, `color.accent.ai`, `radius.md`, `type.weight.medium`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding (its custom properties or its utility classes); no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`, `bg-zinc-900`, `rounded-lg`).
  Fix: Replace with the role's `--lq-*` property or its `lq-` utility class; both are derived from the role's path in spec/tokens (see dist/bindings.json).

## Exemplars

- NN/g (Sep 2024) — no participant read ✨ as AI; use labels
- Canva — named 'Magic' family
- Shape of AI — 'When sparkles alone are applied everywhere, they lose meaning'

## Sources

- https://www.nngroup.com/articles/ai-sparkles-icon-problem/
- https://www.shapeof.ai/patterns/iconography
- https://www.canva.com/magic/
