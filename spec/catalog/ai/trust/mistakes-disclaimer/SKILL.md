---
name: lacquer-mistakes-disclaimer
description: Short, persistent, linked statement that outputs may be wrong; a baseline, not a substitute for citations or uncertainty signals.
---

# 'AI can make mistakes' disclaimer

> Short, persistent, linked statement that outputs may be wrong; a baseline, not a substitute for citations or uncertainty signals.
>
> component · ai/trust · tier 1 · established · status: draft

Also called: ChatGPT can make mistakes. Check important info., Claude can make mistakes. Please double-check responses., Caveat (Shape of AI).

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: enabled
- states.a11y: enabled
- modes.treatment: default, high-stakes
- modes.a11y: default, high-stakes
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: every generative surface
- Avoid: using it to excuse missing verification affordances

Built from: `text`, `link`.

Pairs with: `composer`, `capability-empty-state`, `inline-citation`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `one-line-beneath` |  | required | one line beneath the composer |
| `link-to-limitations-how` |  | required | link to limitations/how it works |
| `optional-stronger-variant` |  | required | optional stronger variant in high-stakes domains |

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
| `high-stakes` | missing | missing |  |

## API (framework-neutral)

Interactions:
- link opens limitations

## Accessibility

- Accessible name: missing

Persistent text meets AA contrast; not a live region.

## Tokens

Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.

Consumes: `color.fg.muted`, `type.label.sm`, `size.measure.prose`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding's custom properties; no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`).
  Fix: Replace with the role's custom property from the binding (see spec/bindings/html.yaml).

## Exemplars

- Apple HIG — 'Clearly communicate that AI-generated content may contain errors'
- HAX G2 — make clear how well the system can do what it can do

## Sources

- https://developer.apple.com/design/human-interface-guidelines/generative-ai
- https://www.microsoft.com/en-us/haxtoolkit/library/
