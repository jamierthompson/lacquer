---
name: lacquer-never-fake-confidence
description: The system prohibits UI that implies certainty, verification or activity the backend cannot substantiate.
---

# Never fake confidence or activity

> The system prohibits UI that implies certainty, verification or activity the backend cannot substantiate.
>
> principle · ai/foundations · tier 1 · established · status: draft

Also called: Design for Imperfection (IBM CHI 2024), Design for Appropriate Trust & Reliance, no fake progress.

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: enabled
- states.a11y: enabled
- accessibility.name
- rules.local (three or more, at least one forbid)

## Use it when / not when

- Use: always
- Avoid: n/a

Pairs with: `uncertainty-display`, `latency-patterns`, `ai-label`, `inline-citation`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `no-invented-confidence` |  | required | no invented confidence scores or 'verified' badges |
| `no-fake-progress` |  | required | no fake progress bars or typing delays |
| `no-fabricated-citations` |  | required | no fabricated citations or source counts |
| `first-person-specific-hedges` |  | required | first-person specific hedges preferred |
| `label-ai-actor` |  | required | label AI actor; no human impersonation |

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

Honest status text is also the accessible status text.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

missing

## Exemplars

- Weisz et al. CHI 2024 — design for imperfection and appropriate reliance
- Kim et al. 2024 — hedges reduce over-reliance; precise language matters

## Sources

- https://arxiv.org/abs/2401.14484
- https://arxiv.org/abs/2405.00623
