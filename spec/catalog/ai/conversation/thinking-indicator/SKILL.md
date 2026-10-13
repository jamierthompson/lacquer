---
name: lacquer-thinking-indicator
description: Shimmering status text ('Thinking…', 'Searching the web') shown between submit and first token; prefer specific status over anonymous dots.
---

# Thinking / typing indicator

> Shimmering status text ('Thinking…', 'Searching the web') shown between submit and first token; prefer specific status over anonymous dots.
>
> component · ai/conversation · tier 1 · established · status: draft

Also called: Shimmer (AI Elements; Loader deprecated 1.8.2), Loader (prompt-kit), Shimmering thinking text (ChatGPT, Claude, Cursor), typing dots.

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: enabled
- states.a11y: enabled
- modes.treatment: thinking, specific-status, hidden
- modes.a11y: thinking, specific-status, hidden
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: any latency between submit and first output
- Avoid: after content has arrived (shimmer must stop)
- Avoid: as a fake delay

Built from: `skeleton`, `spinner`.

Pairs with: `streaming-markdown`, `reasoning-disclosure`, `latency-patterns`, `reduced-motion-streaming`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `status-text` |  | required | status text with shimmer sweep |
| `optional-pulsing-dot` |  | required | optional pulsing dot |
| `elapsed-time-after` |  | required | elapsed time after ~5 s |

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | missing | missing |  |

## Modes

Component-specific display modes. Same contract as states: a treatment and an a11y expression each.

| Mode | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `thinking` | missing | missing |  |
| `specific-status` | missing | missing | specific-status (e.g. Reading 4 files) |
| `hidden` | missing | missing |  |

## API (framework-neutral)

Interactions:
- appears within 300 ms of submit
- replaced by first token

## Accessibility

- Accessible name: missing

Announce 'Thinking' once via status region; shimmer is aria-hidden decoration; static text under reduced motion.

## Tokens

Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.

Consumes: `shimmer.duration`, `shimmer.highlight`, `color.fg.muted`, `motion.reduce`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding's custom properties; no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`).
  Fix: Replace with the role's custom property from the binding (see spec/bindings/html.yaml).

## Exemplars

- Apple HIG — 'Finding substitutions for ingredients' instead of 'Processing…'
- Jim Nielsen (2026) — shimmer text 'shows staying power as genuinely useful UX'

## Sources

- https://developer.apple.com/design/human-interface-guidelines/generative-ai
- https://github.com/vercel/ai-elements/releases
