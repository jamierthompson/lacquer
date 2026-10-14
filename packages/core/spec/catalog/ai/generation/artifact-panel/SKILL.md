---
name: lacquer-artifact-panel
description: Substantial standalone output (code, docs, apps, diagrams) lives in a panel beside the conversation with tabs, versions and actions.
---

# Artifact / canvas side panel

> Substantial standalone output (code, docs, apps, diagrams) lives in a panel beside the conversation with tabs, versions and actions.
>
> component · ai/generation · tier 1 · established · status: draft

Also called: Artifacts (Claude), Canvas (ChatGPT, Gemini), Artifact (AI Elements), artifacts panel (vercel/ai-chatbot).

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: complete
- states.a11y: complete
- modes.treatment: streaming-in, editing, version-n-of-m, published
- modes.a11y: streaming-in, editing, version-n-of-m, published
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: outputs over ~15 lines that the user will edit or reuse
- Avoid: short answers (keep them inline)

Built from: `drawer`, `tabs`, `code-block`, `toolbar`, `button`, `segmented-control`.

Pairs with: `version-history`, `preview-chat-split`, `diff-review`, `streaming-markdown`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `header` |  | required | header: title, description ('Updated 1 minute ago'), version selector |
| `tabs` |  | required | tabs: Preview / Code (/ Source) |
| `actions` |  | required | actions: copy, download, publish/share, open in editor, close |
| `content-area` |  | required | content area |
| `optional-footer` |  | required | optional footer |

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `complete` | missing | missing |  |

## Modes

Component-specific display modes. Same contract as states: a treatment and an a11y expression each.

| Mode | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `streaming-in` | missing | missing |  |
| `editing` | missing | missing | editing (selection edit) |
| `version-n-of-m` | missing | missing | version n-of-m |
| `published` | missing | missing |  |

## API (framework-neutral)

Interactions:
- streams while chat narrates
- switch versions
- select text and 'Edit with AI'
- publish to URL
- full-screen sheet on narrow screens

## Accessibility

- Accessible name: missing

Complementary region or dialog with a name; tabs semantics; focus returns to chat on close; version change announced.

## Tokens

Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.

Consumes: `color.bg.surface`, `color.border.subtle`, `shadow.md`, `radius.lg`, `type.family.mono`, `color.bg.code`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding's custom properties; no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`).
  Fix: Replace with the role's custom property from the binding (see spec/bindings/html.yaml).

## Exemplars

- Claude Artifacts — version selector, 'Edit with Claude' on selection, publish
- AI Elements Artifact — header/actions/content composition

## Sources

- https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them
- https://elements.ai-sdk.dev/components/artifact
