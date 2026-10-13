---
name: lacquer-composer
description: The single most-used control in an AI product: a form with a growing textarea, attachments, tools, mode/model selection and a send/stop button.
---

# Composer (prompt input)

> The single most-used control in an AI product: a form with a growing textarea, attachments, tools, mode/model selection and a send/stop button.
>
> component · ai/conversation · tier 1 · established · status: draft

Also called: PromptInput (AI Elements, prompt-kit), Composer (assistant-ui), CopilotTextarea (CopilotKit), st.chat_input (Streamlit), Open input (Shape of AI).

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: empty, streaming, error, disabled
- states.a11y: empty, streaming, error, disabled
- modes.treatment: typing, attachments-pending, submitting
- modes.a11y: typing, attachments-pending, submitting
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: any conversational or prompt-driven surface
- Use: inline 'ask' panels in augmented products (compact variant)
- Avoid: a single-line search or command palette is the right mental model (use the NL command bar instead)

Built from: `textarea`, `icon-button`, `tooltip`, `dropdown-menu`, `select`, `popover`, `badge`.

Pairs with: `message-list`, `suggested-prompts`, `context-chips`, `model-mode-selector`, `mistakes-disclaimer`, `voice-input`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `container` |  | required | container (rounded, raised, pinned bottom or centered on empty state) |
| `attachment-header` |  | required | attachment header with previews and remove |
| `auto-resizing-textarea` |  | required | auto-resizing textarea (1 to ~8 lines, then scroll) |
| `footer-toolbar` |  | required | footer toolbar: attach, screenshot, slash/actions menu, mode selector, model selector |
| `voice-dictation-button` |  | required | voice/dictation button |
| `send-button` |  | required | send button that becomes stop while generating |
| `disclaimer-line-beneath` |  | required | disclaimer line beneath |

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `empty` | missing | missing |  |
| `streaming` | missing | missing |  |
| `error` | missing | missing |  |
| `disabled` | missing | missing |  |

## Modes

Component-specific display modes. Same contract as states: a treatment and an a11y expression each.

| Mode | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `typing` | missing | missing |  |
| `attachments-pending` | missing | missing |  |
| `submitting` | missing | missing |  |

## API (framework-neutral)

Interactions:
- Enter submits, Shift+Enter newline (configurable to Cmd/Ctrl+Enter)
- drag-drop and paste files
- / opens command menu
- @ opens context/mention picker
- Esc stops generation
- draft persists per thread
- form resets on submit

## Accessibility

- Accessible name: missing

Real textarea with accessible name; toolbar buttons are labelled buttons with tooltips; Stop reachable within one Tab of the textarea; attachment add/remove announced via role=status; documented keyboard shortcuts.

## Tokens

Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.

Consumes: `radius.lg`, `color.bg.surface-raised`, `color.border.subtle`, `shadow.sm`, `space.gap.sm`, `space.gap.md`, `type.body.md`, `color.accent.brand`, `size.measure.prose`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding's custom properties; no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`).
  Fix: Replace with the role's custom property from the binding (see spec/bindings/html.yaml).

## Exemplars

- ChatGPT — pill composer with + menu, tools and dictation
- Gemini — Deep Think toggle inside the prompt bar (Feb 2026)
- AI Elements PromptInput — status-driven submit/stop button

## Sources

- https://elements.ai-sdk.dev/components/prompt-input
- https://www.assistant-ui.com/docs/primitives
- https://gemini.google/release-notes/
