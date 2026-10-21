---
name: lacquer-reasoning-disclosure
description: A collapsible, de-emphasised view of the model's reasoning or step trace that opens while streaming and collapses when the answer begins.
---

# Reasoning / extended-thinking disclosure

> A collapsible, de-emphasised view of the model's reasoning or step trace that opens while streaming and collapses when the answer begins.
>
> component · ai/conversation · tier 1 · emerging · status: draft

Also called: Reasoning (AI Elements, prompt-kit), ChainOfThought (assistant-ui, AI Elements), Thought for N seconds (ChatGPT), Show thinking (Gemini), Stream of Thought (Shape of AI), Chainlit Step cot.

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: streaming, complete
- states.a11y: streaming, complete
- modes.treatment: pinned-open, hidden
- modes.a11y: pinned-open, hidden
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: reasoning models
- Use: research/agent products where steps and sources matter
- Avoid: styling reasoning as proof of correctness
- Avoid: expanding by default after completion

Built from: `disclosure`, `badge`, `list`.

Pairs with: `thinking-indicator`, `tool-call-card`, `disclosure-conventions`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `collapsible-trigger` |  | required | collapsible trigger with status text and elapsed time |
| `muted-reasoning-text` |  | required | muted reasoning text |
| `optional-step-list` |  | required | optional step list with complete/active/pending |
| `optional-search-results` |  | required | optional search results and images per step |

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `streaming` | missing | missing |  |
| `complete` | missing | missing |  |

## Modes

Component-specific display modes. Same contract as states: a treatment and an a11y expression each.

| Mode | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `pinned-open` | missing | missing |  |
| `hidden` | missing | missing | hidden (no reasoning) |

## API (framework-neutral)

Interactions:
- auto-open while streaming, auto-close when answer starts
- user toggle overrides
- steps expand to show outputs

## Accessibility

- Accessible name: missing

Disclosure button with aria-expanded and a region; reasoning text not announced live; announce start once and duration on completion.

## Tokens

Roles, not values. A role is a token path in spec/tokens; the html binding reads it as `--lq-<role-with-dashes>`, the tailwind binding as an `lq-` utility (dist/bindings.json has both).

Consumes: `color.fg.muted`, `type.body.sm`, `shimmer.duration`, `space.gap.sm`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding (its custom properties or its utility classes); no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`, `bg-zinc-900`, `rounded-lg`).
  Fix: Replace with the role's `--lq-*` property or its `lq-` utility class; both are derived from the role's path in spec/tokens (see dist/bindings.json).

## Exemplars

- AI Elements Reasoning — auto open/close, 'Thought for N seconds'
- Anthropic (Feb 2025) — caveat that visible thinking may not reflect the model's actual process
- Perplexity — 'Completed 2 steps' before the answer

## Sources

- https://elements.ai-sdk.dev/components/reasoning
- https://elements.ai-sdk.dev/components/chain-of-thought
- https://www.anthropic.com/news/visible-extended-thinking
