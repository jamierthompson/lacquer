---
name: lacquer-explainability-popover
description: A partial, decision-relevant explanation of why the AI produced this, anchored to the AI element.
---

# Explainability popover ('why this?')

> A partial, decision-relevant explanation of why the AI produced this, anchored to the AI element.
>
> component · ai/trust · tier 2 · established · status: draft

Also called: explainability popover (Carbon AI label), Why this? (recommenders), Explainable Rationale (Smashing), personalisation sources (ChatGPT book icon), HAX G11.

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: enabled
- states.a11y: enabled
- modes.treatment: closed, open, partial
- modes.a11y: closed, open, partial
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: personalised or consequential outputs
- Avoid: explaining everything (PAIR: the best explanation is likely a partial one)

Built from: `popover`, `drawer`, `list`, `link`, `button`.

Pairs with: `ai-label`, `memory-indicator`, `uncertainty-display`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `anchored-popover` |  | required | anchored popover or drawer |
| `what-data-was` |  | required | what data was used (sources, memories, files, selection) |
| `which-model` |  | required | which model, when |
| `how-to-change` |  | required | how to change it (settings links) |
| `feedback` |  | required | feedback |

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | missing | missing |  |

## Modes

Component-specific display modes. Same contract as states: a treatment and an a11y expression each.

| Mode | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `closed` | missing | missing |  |
| `open` | missing | missing |  |
| `partial` | missing | missing | partial (limited explanation available) |

## API (framework-neutral)

Interactions:
- open from AI label or info glyph
- navigate to settings

## Accessibility

- Accessible name: missing

Dialog/popover semantics with focus trap or return; content readable as text.

## Tokens

Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.

Consumes: `color.bg.surface-raised`, `color.border.ai`, `shadow.md`, `radius.md`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding's custom properties; no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`).
  Fix: Replace with the role's custom property from the binding (see spec/bindings/html.yaml).

## Exemplars

- Carbon — popover sections: overview, supporting details, artifacts, actions
- ChatGPT — book icon lists custom instructions, past chats, files and memories used

## Sources

- https://carbondesignsystem.com/components/ai-label/usage/
- https://help.openai.com/en/articles/8590148-memory-faq
- https://pair.withgoogle.com/chapter/explainability-trust/
