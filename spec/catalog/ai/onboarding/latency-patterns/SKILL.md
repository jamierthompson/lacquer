---
name: lacquer-latency-patterns
description: An ordered ladder of honest latency techniques and a list of fakes to prohibit.
---

# Latency patterns (honest perceived performance)

> An ordered ladder of honest latency techniques and a list of fakes to prohibit.
>
> method · ai/onboarding · tier 1 · established · status: draft

Also called: progressive disclosure of partial results, optimistic UI (user actions only), chunked reveal, background generation.

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: enabled
- states.a11y: enabled
- accessibility.name
- rules.local (three or more, at least one forbid)

## Use it when / not when

- Use: any generation
- Avoid: fake progress bars, fake thinking delays, shimmer after arrival

Built from: `progress`, `skeleton`, `toast`.

Pairs with: `generation-progress`, `thinking-indicator`, `background-job-card`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `part-1-stream` |  | required | 1 stream the real thing |
| `part-2-show-completed` |  | required | 2 show completed steps while later ones run |
| `part-3-specific-status` |  | required | 3 specific status text |
| `part-4-optimistic-ui` |  | required | 4 optimistic UI for user actions only |
| `part-5-chunk-fade` |  | required | 5 chunk fade; typewriter only to smooth bursts |
| `part-6-background-job` |  | required | 6 background job above ~30–60 s |

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | missing | missing |  |

## API (framework-neutral)

Interactions:
- none

## Accessibility

- Accessible name: missing

All steps must announce state once, never continuously; reduced motion disables smoothing effects.

## Tokens

Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.

Consumes: `stream.reveal-duration`, `shimmer.duration`, `motion.reduce`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

missing

## Exemplars

- Apple HIG — specific, reassuring feedback during generation
- NN/g — ChatGPT Agent's 11-minute task should have been backgrounded

## Sources

- https://developer.apple.com/design/human-interface-guidelines/generative-ai
- https://www.nngroup.com/articles/impressions-chatgpt-agent/
