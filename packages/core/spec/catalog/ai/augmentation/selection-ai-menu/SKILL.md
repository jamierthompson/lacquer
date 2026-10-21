---
name: lacquer-selection-ai-menu
description: AI where the user already is: select, choose a verb, review the result next to the original, then replace or discard.
---

# Selection AI menu (inline AI on text selection)

> AI where the user already is: select, choose a verb, review the result next to the original, then replace or discard.
>
> component · ai/augmentation · tier 1 · established · status: draft

Also called: Edit with AI (Notion), Writing Tools (Apple), AI Commands (Raycast), Help me write (Google Docs), SelectionToolbar (assistant-ui), Inline Action / Restyle / Expand (Shape of AI).

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: enabled
- states.a11y: enabled
- modes.treatment: hidden, menu-open, generating, preview, applied, discarded
- modes.a11y: hidden, menu-open, generating, preview, applied, discarded
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: editors and any text field with meaningful content
- Avoid: replacing text silently
- Avoid: menus that hide the original

Built from: `toolbar`, `popover`, `dropdown-menu`, `button`, `textarea`.

Pairs with: `generate-button`, `ai-label`, `diff-review`, `undo-rollback`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `floating-toolbar` |  | required | floating toolbar or context-menu section on selection |
| `preset-verbs` |  | required | preset verbs: Improve, Shorten, Expand, Fix, Translate, Change tone |
| `free-prompt-field` |  | required | free prompt field |
| `result-preview-beside-below` |  | required | result preview beside/below original |
| `actions` |  | required | actions: Replace / Insert below / Copy / Try again / Discard |

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | missing | missing |  |

## Modes

Component-specific display modes. Same contract as states: a treatment and an a11y expression each.

| Mode | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `hidden` | missing | missing |  |
| `menu-open` | missing | missing |  |
| `generating` | missing | missing |  |
| `preview` | missing | missing |  |
| `applied` | missing | missing |  |
| `discarded` | missing | missing |  |

## API (framework-neutral)

Interactions:
- select text then open
- keyboard shortcut opens on current selection
- try again keeps original
- undo after replace

## Accessibility

- Accessible name: missing

Toolbar reachable by shortcut and announced; preview is a dialog or live region; original never replaced without confirmation.

## Tokens

Roles, not values. A role is a token path in spec/tokens; the html binding reads it as `--lq-<role-with-dashes>`, the tailwind binding as an `lq-` utility (dist/bindings.json has both).

Consumes: `color.bg.surface-raised`, `shadow.md`, `radius.md`, `color.accent.ai`, `type.body.sm`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding (its custom properties or its utility classes); no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`, `bg-zinc-900`, `rounded-lg`).
  Fix: Replace with the role's `--lq-*` property or its `lq-` utility class; both are derived from the role's path in spec/tokens (see dist/bindings.json).

## Exemplars

- Notion — select text → Edit with AI; accept, discard, or try again
- Raycast — Improve Writing / Fix Spelling on selected text

## Sources

- https://www.notion.com/help/guides/notion-ai-for-docs
- https://manual.raycast.com/ai
- https://www.assistant-ui.com/docs/primitives
