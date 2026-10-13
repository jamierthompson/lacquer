---
name: lacquer-anti-dark-patterns
description: Maps each documented LLM dark pattern to the UI amplifier to prohibit and the system-level countermeasure.
---

# AI-specific dark patterns and countermeasures

> Maps each documented LLM dark pattern to the UI amplifier to prohibit and the system-level countermeasure.
>
> principle · ai/foundations · tier 1 · emerging · status: draft

Also called: DarkBench: brand bias, user retention, sycophancy, anthropomorphism, harmful generation, sneaking, Dark Matter (Shape of AI).

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: enabled
- states.a11y: enabled
- accessibility.name
- rules.local (three or more, at least one forbid)

## Use it when / not when

- Use: always
- Avoid: n/a

Built from: `badge`.

Pairs with: `feedback-control`, `memory-indicator`, `ai-label`, `quota-notice`, `suggested-prompts`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `sycophancy-reason-coded` |  | required | sycophancy → reason-coded feedback, no reward for agreement |
| `retention-hooks` |  | required | retention hooks → task-relevant follow-ups only, no streaks, temporary mode |
| `fake-urgency` |  | required | fake urgency → real progress and quota facts only |
| `anthropomorphism-ai` |  | required | anthropomorphism → AI label, no fake typing delays, no human names/avatars by default |
| `hidden-data-use` |  | required | hidden data use → memory chip, consent at first run |
| `sneaking-brand-bias` |  | required | sneaking/brand bias → 'Sponsored' variant, domain-first citations |

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

n/a

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

missing

## Exemplars

- Kran et al. 2025 — some LLMs 'favor their developers' products and exhibit untruthful communication'
- Shape of AI — 'Don't fake human interaction'

## Sources

- https://arxiv.org/abs/2503.10728
- https://openai.com/index/expanding-on-sycophancy/
- https://www.shapeof.ai/patterns/disclosure
