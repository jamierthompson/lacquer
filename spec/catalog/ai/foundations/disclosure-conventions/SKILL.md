---
name: lacquer-disclosure-conventions
description: Keeps the thread readable: detail is one click away, blocking states are never hidden.
---

# Disclosure conventions (collapsed vs expanded by default)

> Keeps the thread readable: detail is one click away, blocking states are never hidden.
>
> principle · ai/foundations · tier 1 · established · status: draft

Also called: progressive disclosure (NN/g), collapsed by default (AI Elements Tool), auto-open while streaming (AI Elements Reasoning).

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: enabled
- states.a11y: enabled
- accessibility.name
- rules.local (three or more, at least one forbid)

## Use it when / not when

- Use: always
- Avoid: expanding every tool call
- Avoid: hiding approvals inside collapsed cards

Built from: `disclosure`.

Pairs with: `tool-call-card`, `reasoning-disclosure`, `sources-panel`, `approval-prompt`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `collapsed-by-default` |  | required | collapsed by default: tool cards, sources list, activity detail, reasoning after completion |
| `open-by-default` |  | required | open by default: errors, approvals, needs-input, plans awaiting approval |
| `auto-open-while-streaming` |  | required | auto-open while streaming then collapse: reasoning |
| `grouped` |  | required | grouped: repeated tool calls |

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | missing | missing |  |

## API (framework-neutral)

Interactions:
- user pin overrides defaults

## Accessibility

- Accessible name: missing

All disclosures are button[aria-expanded] + region.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

missing

## Exemplars

- NN/g (Apr 2026) — progressive disclosure keeps the chat short
- AI Elements — tools default collapsed; Reasoning auto-opens while streaming

## Sources

- https://www.nngroup.com/articles/ai-chatbots-design-guidelines/
- https://elements.ai-sdk.dev/components/tool
- https://elements.ai-sdk.dev/components/reasoning
