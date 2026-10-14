---
name: lacquer-ai-label
description: Marks AI-generated content and is the doorway to explainability; in the EU, first-turn disclosure is required from 2 August 2026.
---

# AI disclosure label / badge

> Marks AI-generated content and is the doorway to explainability; in the EU, first-turn disclosure is required from 2 August 2026.
>
> component · ai/trust · tier 1 · established · status: draft

Also called: AI label (IBM Carbon, formerly AI slug), Disclosure (Shape of AI), AI badge (Intercom Fin), Generated with AI chip, Article 50 disclosure.

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: enabled
- states.a11y: enabled
- modes.treatment: present, explained, overridden, hidden
- modes.a11y: present, explained, overridden, hidden
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: any AI-generated content in a mixed human/AI product
- Use: chatbots (first turn)
- Avoid: as decoration
- Avoid: as the trigger for AI actions (Carbon)

Built from: `badge`, `popover`, `button`, `icon`.

Pairs with: `explainability-popover`, `mistakes-disclaimer`, `content-credentials`, `ai-summary-card`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `ai-button` |  | required | 'AI' button or chip (mini 16 px to XL 64 px; inline variant for text) |
| `explainability-popover` |  | required | explainability popover: overview, supporting details, resources, actions |
| `revert-button-replaces` |  | required | revert button replaces label after user override |
| `actor-name-glyph` |  | required | actor name/glyph on messages |
| `first-turn-chatbot-disclosure` |  | required | first-turn chatbot disclosure |

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | missing | missing |  |

## Modes

Component-specific display modes. Same contract as states: a treatment and an a11y expression each.

| Mode | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `present` | missing | missing |  |
| `explained` | missing | missing | explained (popover open) |
| `overridden` | missing | missing | overridden (revert shown) |
| `hidden` | missing | missing | hidden (no AI involvement) |

## API (framework-neutral)

Interactions:
- click for explanation
- revert to AI version
- never triggers generation

## Accessibility

- Accessible name: missing

Button named 'AI generated, show details'; popover is a dialog/tooltip with focus management; label text translatable.

## Tokens

Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.

Consumes: `color.accent.ai`, `color.border.ai`, `color.accent.ai-subtle`, `type.label.sm`, `radius.sm`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding's custom properties; no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`).
  Fix: Replace with the role's custom property from the binding (see spec/bindings/html.yaml).

## Exemplars

- Carbon — 'the key pathway to AI explainability'; revert replaces label
- Shape of AI — 'Name the actor, every time'; 'Label the action, not just the feature'
- EU AI Act Art. 50(1) — inform from the start of the first interaction

## Sources

- https://carbondesignsystem.com/components/ai-label/usage/
- https://www.shapeof.ai/patterns/disclosure
- https://digital-strategy.ec.europa.eu/en/faqs/transparency-obligations-under-article-50-ai-act
