---
name: lacquer-suggested-prompts
description: Specific, contextual prompt buttons at the start of a conversation and after answers; buttons, not text.
---

# Suggested prompts and follow-ups

> Specific, contextual prompt buttons at the start of a conversation and after answers; buttons, not text.
>
> component · ai/conversation · tier 1 · established · status: draft

Also called: Suggestion (AI Elements, assistant-ui), PromptSuggestion (prompt-kit), Follow up / Suggestions / Templates (Shape of AI Wayfinders), CopilotKit suggestions, related questions.

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: loading
- states.a11y: loading
- modes.treatment: starter, follow-up, hidden
- modes.a11y: starter, follow-up, hidden
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: empty states
- Use: after answers where a next step is likely
- Use: onboarding to capabilities
- Avoid: generic suggestions ('Get ideas')
- Avoid: engagement-bait follow-ups unrelated to the task

Built from: `button`, `tag`, `scroll-area`, `card`.

Pairs with: `capability-empty-state`, `composer`, `message-actions`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `group-label` |  | required | group label (Suggested) |
| `row-of-2` |  | required | row of 2–6 pill buttons (starter) or 2–4 (follow-up) |
| `optional-card-variant` |  | required | optional card variant with icon and description for empty state |

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `loading` | missing | missing |  |

## Modes

Component-specific display modes. Same contract as states: a treatment and an a11y expression each.

| Mode | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `starter` | missing | missing | starter (empty state) |
| `follow-up` | missing | missing | follow-up (after answer) |
| `hidden` | missing | missing |  |

## API (framework-neutral)

Interactions:
- click sends the prompt (default) or fills the composer when the prompt has slots
- horizontal scroll on narrow screens

## Accessibility

- Accessible name: missing

Real buttons inside a labelled group; keyboard reachable scroll row; sent suggestion appears as the user's message.

## Tokens

Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.

Consumes: `radius.pill`, `color.border.subtle`, `color.bg.surface-raised`, `type.body.sm`, `space.gap.sm`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding's custom properties; no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`).
  Fix: Replace with the role's custom property from the binding (see spec/bindings/html.yaml).

## Exemplars

- NN/g (Jun 2025) — 'Easy family dinner ideas' beats generic
- NN/g (Apr 2026) — suggested questions as buttons, not text

## Sources

- https://www.nngroup.com/articles/designing-use-case-prompt-suggestions/
- https://www.nngroup.com/articles/ai-chatbots-design-guidelines/
- https://elements.ai-sdk.dev/components/suggestion
