---
name: lacquer-model-mode-selector
description: Mode (what the AI is allowed to do) lives in the composer; model (which engine) lives in a secondary menu.
---

# Model and mode selector

> Mode (what the AI is allowed to do) lives in the composer; model (which engine) lives in a secondary menu.
>
> component · ai/conversation · tier 2 · established · status: draft

Also called: ModelSelector (AI Elements), model dropdown (ChatGPT, Gemini), Model management / Modes (Shape of AI Tuners), Plan/Build (Lovable), permission modes (Claude Code), Code/Chat (Windsurf).

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: enabled
- states.a11y: enabled
- modes.treatment: default, open, changed-mid-thread
- modes.a11y: default, open, changed-mid-thread
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: multiple models or autonomy levels are user-facing
- Avoid: a single model with no meaningful choice

Built from: `select`, `dropdown-menu`, `command-palette`, `segmented-control`, `badge`.

Pairs with: `composer`, `autonomy-dial`, `model-version-badge`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `mode` |  | required | mode: segmented control or toggle in the composer with plain-word labels and one-line 'best for' |
| `model` |  | required | model: menu or searchable palette grouped by provider with logos |
| `current-selection-badge` |  | required | current selection badge |

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | missing | missing |  |

## Modes

Component-specific display modes. Same contract as states: a treatment and an a11y expression each.

| Mode | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `default` | missing | missing |  |
| `open` | missing | missing |  |
| `changed-mid-thread` | missing | missing | changed mid-thread (marker in transcript) |

## API (framework-neutral)

Interactions:
- search models
- switch mode with shortcut (Shift+Tab in Claude Code)
- multi-select for side-by-side comparison (Cursor)

## Accessibility

- Accessible name: missing

Listbox/menu semantics; current value announced; shortcut documented.

## Tokens

Roles, not values. A role is a token path in spec/tokens; the html binding reads it as `--lq-<role-with-dashes>`, the tailwind binding as an `lq-` utility (dist/bindings.json has both).

Consumes: `color.bg.surface-raised`, `radius.md`, `type.body.sm`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding (its custom properties or its utility classes); no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`, `bg-zinc-900`, `rounded-lg`).
  Fix: Replace with the role's `--lq-*` property or its `lq-` utility class; both are derived from the role's path in spec/tokens (see dist/bindings.json).

## Exemplars

- Gemini — 'select 3.6 Flash in the model drop down' (Jul 2026)
- AI Elements ModelSelector — cmdk palette grouped by provider

## Sources

- https://elements.ai-sdk.dev/components/model-selector
- https://gemini.google/release-notes/
- https://code.claude.com/docs/en/permission-modes
