---
name: lacquer-capability-empty-state
description: Where HAX G1/G2 live: what the system can do, how well, and a few specific ways to start.
---

# Capability and limitation pane (empty state)

> Where HAX G1/G2 live: what the system can do, how well, and a few specific ways to start.
>
> component · ai/onboarding · tier 1 · established · status: draft

Also called: Examples / Capabilities / Limitations (early ChatGPT), greeting + suggestions (Claude, Gemini), Example gallery, Initial CTA, Nudges, Templates (Shape of AI Wayfinders), Thread welcome (assistant-ui).

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: enabled
- states.a11y: enabled
- modes.treatment: first-run, returning, project-scoped
- modes.a11y: first-run, returning, project-scoped
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: every new thread
- Avoid: vague greetings with no capabilities (NN/g)

Built from: `heading`, `button`, `card`, `link`.

Pairs with: `suggested-prompts`, `first-run-education`, `mistakes-disclaimer`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `greeting` |  | required | greeting |
| `part-3` |  | required | 3–6 specific starter prompts as buttons |
| `one-line-limitations` |  | required | one-line limitations with link |
| `centered-composer` |  | required | centered composer that moves to bottom after first message |

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | missing | missing |  |

## Modes

Component-specific display modes. Same contract as states: a treatment and an a11y expression each.

| Mode | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `first-run` | missing | missing |  |
| `returning` | missing | missing | returning (personalised) |
| `project-scoped` | missing | missing |  |

## API (framework-neutral)

Interactions:
- click starter
- dismiss education

## Accessibility

- Accessible name: missing

Heading structure; starters are buttons; composer focused on load.

## Tokens

Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.

Consumes: `size.measure.prose`, `space.gap.lg`, `type.body.lg`, `color.fg.muted`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding's custom properties; no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`).
  Fix: Replace with the role's custom property from the binding (see spec/bindings/html.yaml).

## Exemplars

- NN/g (Apr 2026) — show what the chatbot can do through messages and suggested prompts
- Apple HIG — let people know limitations up front and how to get good results

## Sources

- https://www.nngroup.com/articles/ai-chatbots-design-guidelines/
- https://www.shapeof.ai/
