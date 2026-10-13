---
name: lacquer-uncertainty-display
description: Show uncertainty as specific first-person language or localised categorical markers; the evidence says raw probabilities do not help.
---

# Confidence / uncertainty display

> Show uncertainty as specific first-person language or localised categorical markers; the evidence says raw probabilities do not help.
>
> component · ai/trust · tier 2 · emerging · status: draft

Also called: Confidence Signal (Smashing), Caveat (Shape of AI), citation strength indicator, edit-likelihood highlighting.

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: enabled
- states.a11y: enabled
- modes.treatment: confident, hedged, low, unknown
- modes.a11y: confident, hedged, low, unknown
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: a calibrated signal exists and affects a decision
- Avoid: no calibrated signal (show nothing)
- Avoid: numeric percentages for general audiences
- Avoid: global scores on a whole answer

Built from: `badge`, `tooltip`, `highlight`.

Pairs with: `inline-citation`, `explainability-popover`, `never-fake-confidence`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `preferred` |  | required | preferred: first-person, specific hedge inside the answer |
| `categorical-badge` |  | required | categorical badge (high/medium/low) localised to a claim, hunk or cell |
| `n-best-alternatives-when` |  | required | N-best alternatives when confidence is low |
| `never-a-bare` |  | required | never a bare percentage without context |

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | missing | missing |  |

## Modes

Component-specific display modes. Same contract as states: a treatment and an a11y expression each.

| Mode | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `confident` | missing | missing | confident (no marker) |
| `hedged` | missing | missing |  |
| `low` | missing | missing | low (alternatives shown) |
| `unknown` | missing | missing | unknown (no signal shown) |

## API (framework-neutral)

Interactions:
- hover for basis
- open alternatives

## Accessibility

- Accessible name: missing

Text hedge is inherently accessible; badges carry text; colour never the only signal.

## Tokens

Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.

Consumes: `color.status.warning`, `color.fg.muted`, `type.label.sm`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding's custom properties; no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`).
  Fix: Replace with the role's custom property from the binding (see spec/bindings/html.yaml).

## Exemplars

- Kim et al. FAccT 2024 — 'I'm not sure, but…' reduced over-reliance and increased accuracy
- Vasconcelos et al. TOCHI 2024 — highlighting likely-to-be-edited tokens helped; generation probability did not
- PAIR — display confidence only when it improves decisions

## Sources

- https://arxiv.org/abs/2405.00623
- https://arxiv.org/abs/2302.07248
- https://pair.withgoogle.com/chapter/explainability-trust/
