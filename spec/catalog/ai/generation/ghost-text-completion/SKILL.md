---
name: lacquer-ghost-text-completion
description: Predictive text rendered as dimmed ghost text; Tab accepts, anything else discards; never moves existing text.
---

# Inline ghost-text completion

> Predictive text rendered as dimmed ghost text; Tab accepts, anything else discards; never moves existing text.
>
> component · ai/generation · tier 2 · established · status: draft

Also called: Copilot inline suggestions, Cursor Tab, Next Edit Suggestions (VS Code), Smart Compose, Auto-fill (Shape of AI).

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: enabled
- states.a11y: enabled
- modes.treatment: hidden, suggesting, partially-accepted, dismissed
- modes.a11y: hidden, suggesting, partially-accepted, dismissed
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: code editors
- Use: long-form writing
- Use: repetitive form entry
- Avoid: latency above ~300 ms
- Avoid: fields where a wrong accept is costly

Built from: `textarea`, `code-editor`, `tooltip`.

Pairs with: `smart-autofill`, `diff-review`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `dimmed-suggestion-after` |  | required | dimmed suggestion after the caret |
| `gutter-arrow` |  | required | gutter arrow for next-edit suggestions |
| `hover-toolbar` |  | required | hover toolbar with alternatives |

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | missing | missing |  |

## Modes

Component-specific display modes. Same contract as states: a treatment and an a11y expression each.

| Mode | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `hidden` | missing | missing |  |
| `suggesting` | missing | missing |  |
| `partially-accepted` | missing | missing |  |
| `dismissed` | missing | missing |  |

## API (framework-neutral)

Interactions:
- Tab accepts
- Esc dismisses
- Cmd/Ctrl+Right accepts word/line
- typing discards
- hover cycles alternatives

## Accessibility

- Accessible name: missing

Announce that a suggestion exists; accessible view to read it; never the only way to enter content; low contrast acceptable only because transient.

## Tokens

Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.

Consumes: `color.fg.ghost`, `type.family.mono`, `type.body.md`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding's custom properties; no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`).
  Fix: Replace with the role's custom property from the binding (see spec/bindings/html.yaml).

## Exemplars

- VS Code — 'dimmed ghost text… Accept a suggestion by pressing the Tab key'
- Next Edit Suggestions — gutter arrow

## Sources

- https://code.visualstudio.com/docs/copilot/ai-powered-suggestions
