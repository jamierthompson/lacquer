---
name: lacquer-ai-accent-token
description: Define AI tokens as aliases of the brand system so AI surfaces look like the product, not like every other AI product.
---

# AI features inherit the brand (--ai-accent as an alias)

> Define AI tokens as aliases of the brand system so AI surfaces look like the product, not like every other AI product.
>
> principle · ai/foundations · tier 1 · emerging · status: draft

Also called: no 'AI purple', Carbon AI styling tokens (ai-border-start/end, ai-aura-start/end), Identifiers: Color, Iconography, Name (Shape of AI).

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: enabled
- states.a11y: enabled
- accessibility.name
- rules.local (three or more, at least one forbid)

## Use it when / not when

- Use: always
- Avoid: introducing a separate purple/gradient palette
- Avoid: decorative animated gradients

Pairs with: `ai-label`, `generate-button`, `reduced-motion-streaming`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `ai-accent-aliases` |  | required | --ai-accent aliases an existing brand/accent token |
| `ai-accent-subtle-8` |  | required | --ai-accent-subtle 8–12% tint for labelled containers |
| `ai-border-for-labelled` |  | required | --ai-border for labelled AI containers (optional gradient) |
| `ai-popover-bg` |  | required | --ai-popover-bg |
| `signal-ai` |  | required | signal AI with labels and structure, not colour |
| `glow-only` |  | required | glow only on the border of labelled content |

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

All AI-tinted surfaces keep AA contrast for text; gradients never carry meaning alone.

## Tokens

Roles, not values. A role is a token path in spec/tokens; the html binding reads it as `--lq-<role-with-dashes>`, the tailwind binding as an `lq-` utility (dist/bindings.json has both).

Consumes: `color.accent.ai`, `color.accent.ai-subtle`, `color.border.ai`, `color.bg.surface-raised`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

missing

## Exemplars

- Carbon — AI tokens extend existing themes; styling is identification, not decoration
- OpenAI Apps SDK — 'Use system colors for text, icons, and spatial elements'; brand accents only on buttons and badges
- Indie Hackers/DEV — 'the AI purple problem' critiques

## Sources

- https://carbondesignsystem.com/guidelines/carbon-for-ai/
- https://developers.openai.com/apps-sdk/concepts/ui-guidelines
