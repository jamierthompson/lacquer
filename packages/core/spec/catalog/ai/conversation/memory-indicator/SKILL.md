---
name: lacquer-memory-indicator
description: Makes silent personalisation visible: a chip when memory changes, a popover showing which memories shaped an answer, and a management page.
---

# Memory indicator and management

> Makes silent personalisation visible: a chip when memory changes, a popover showing which memories shaped an answer, and a management page.
>
> component · ai/conversation · tier 2 · emerging · status: draft

Also called: Memory updated (ChatGPT), Memory (Shape of AI Governors), memories (Gemini), project knowledge (Claude), Incognito / Temporary chat.

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: enabled
- states.a11y: enabled
- modes.treatment: updated, used-in-response, temporary, off
- modes.a11y: updated, used-in-response, temporary, off
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: any product that persists user facts across sessions
- Avoid: saving memories silently (hidden data use dark pattern)

Built from: `tag`, `popover`, `list`, `switch`, `dialog`.

Pairs with: `explainability-popover`, `data-use-notice`, `conversation-history`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `inline-chip` |  | required | inline chip on the message ('Memory updated') opening what was saved with Forget |
| `settings-page-listing` |  | required | settings page listing memories with delete and last-updated |
| `per-response-personalisation-sources` |  | required | per-response personalisation sources popover |
| `temporary-chat-mode-toggle` |  | required | temporary-chat mode toggle |

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | missing | missing |  |

## Modes

Component-specific display modes. Same contract as states: a treatment and an a11y expression each.

| Mode | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `updated` | missing | missing |  |
| `used-in-response` | missing | missing |  |
| `temporary` | missing | missing | temporary (no memory) |
| `off` | missing | missing |  |

## API (framework-neutral)

Interactions:
- click chip to view/forget
- manage all in settings
- toggle temporary chat

## Accessibility

- Accessible name: missing

Chip is a button; status announced once; settings list is a table/list with delete confirmations.

## Tokens

Roles, not values. A role is a token path in spec/tokens; the html binding reads it as `--lq-<role-with-dashes>`, the tailwind binding as an `lq-` utility (dist/bindings.json has both).

Consumes: `color.accent.ai-subtle`, `type.label.sm`, `radius.pill`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding (its custom properties or its utility classes); no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`, `bg-zinc-900`, `rounded-lg`).
  Fix: Replace with the role's `--lq-*` property or its `lq-` utility class; both are derived from the role's path in spec/tokens (see dist/bindings.json).

## Exemplars

- ChatGPT — book icon below a response lists sources used to personalise it; summary shows 'last updated 2 hours ago'
- Gemini — chat history renamed 'memories' (Mar 2026)

## Sources

- https://help.openai.com/en/articles/8590148-memory-faq
- https://gemini.google/release-notes/
