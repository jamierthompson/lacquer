---
name: lacquer-nl-command-bar
description: A command palette whose fallback is an AI answer or action, never displacing exact command matches.
---

# Natural-language command bar

> A command palette whose fallback is an AI answer or action, never displacing exact command matches.
>
> component · ai/augmentation · tier 2 · established · status: draft

Also called: Quick AI (Raycast), Cmd+K with Ask row, Copilot in-app command bar, Open input + Madlibs (Shape of AI).

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: enabled
- states.a11y: enabled
- modes.treatment: matching-commands, ai-fallback, answering, answered
- modes.a11y: matching-commands, ai-fallback, answering, answered
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: products with an existing palette or search
- Avoid: making the AI row the default over deterministic commands

Built from: `command-palette`, `list`, `card`, `kbd`.

Pairs with: `ask-about-this-page`, `context-chips`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `command-palette-input` |  | required | command palette input |
| `deterministic-command-matches` |  | required | deterministic command matches first |
| `ai-row-as` |  | required | AI row as fallback ('Ask about…') |
| `inline-answer-card` |  | required | inline answer card |
| `continue-in-chat-escape-hatch` |  | required | continue-in-chat escape hatch |

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | missing | missing |  |

## Modes

Component-specific display modes. Same contract as states: a treatment and an a11y expression each.

| Mode | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `matching-commands` | missing | missing |  |
| `ai-fallback` | missing | missing |  |
| `answering` | missing | missing |  |
| `answered` | missing | missing |  |

## API (framework-neutral)

Interactions:
- Tab or Enter on AI row
- expand to chat

## Accessibility

- Accessible name: missing

Combobox/listbox semantics; AI row labelled as AI; answer announced once.

## Tokens

Roles, not values. A role is a token path in spec/tokens; the html binding reads it as `--lq-<role-with-dashes>`, the tailwind binding as an `lq-` utility (dist/bindings.json has both).

Consumes: `color.bg.surface-raised`, `shadow.lg`, `radius.lg`, `type.body.sm`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding (its custom properties or its utility classes); no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`, `bg-zinc-900`, `rounded-lg`).
  Fix: Replace with the role's `--lq-*` property or its `lq-` utility class; both are derived from the role's path in spec/tokens (see dist/bindings.json).

## Exemplars

- Raycast — 'Ask a one-off question from Root Search'

## Sources

- https://manual.raycast.com/ai
