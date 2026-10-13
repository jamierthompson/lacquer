---
name: lacquer-preview-chat-split
description: The app-builder layout: conversation on one side, a live preview with tabs and a selection-to-prompt toolbar on the other.
---

# Preview + chat split layout with live preview pane

> The app-builder layout: conversation on one side, a live preview with tabs and a selection-to-prompt toolbar on the other.
>
> component · ai/generation · tier 1 · established · status: draft

Also called: v0 workspace (Preview / Code / Design tabs), Lovable editor + preview toolbar, Bolt, WebPreview + Sandbox (AI Elements), Cursor Design Mode.

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: error
- states.a11y: error
- modes.treatment: building, preview-ready, code-view, design-mode
- modes.a11y: building, preview-ready, code-view, design-mode
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: generated UI, sites or apps
- Avoid: document-only products (use the artifact panel)

Built from: `resizable-panels`, `tabs`, `toolbar`, `iframe`, `code-block`, `button`.

Pairs with: `artifact-panel`, `context-chips`, `version-history`, `terminal-panel`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `chat-column` |  | required | chat column (30–40%, min 320 px) |
| `preview-column` |  | required | preview column with toolbar: device size, URL/navigation, tabs, console drawer, publish |
| `iframe-body` |  | required | iframe body |
| `selection-to-prompt-tool` |  | required | selection-to-prompt tool |
| `tabs-below-900` |  | required | tabs below ~900 px |

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `error` | missing | missing |  |

## Modes

Component-specific display modes. Same contract as states: a treatment and an a11y expression each.

| Mode | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `building` | missing | missing |  |
| `preview-ready` | missing | missing |  |
| `code-view` | missing | missing | code view |
| `design-mode` | missing | missing | design mode |

## API (framework-neutral)

Interactions:
- select element to attach as context
- inline text edit
- draw annotation
- comment pin
- publish

## Accessibility

- Accessible name: missing

Iframe titled; toolbar buttons labelled; annotation tools have keyboard equivalents; console is a log region.

## Tokens

Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.

Consumes: `color.bg.surface`, `color.border.subtle`, `space.gap.md`, `radius.md`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding's custom properties; no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`).
  Fix: Replace with the role's custom property from the binding (see spec/bindings/html.yaml).

## Exemplars

- Lovable preview toolbar — select elements, inline text edits, draw annotation, comments
- v0 — Preview, Code and Design tabs in the preview toolbar
- Cursor 3.0 Design Mode — point the agent to exactly the part of the interface

## Sources

- https://docs.lovable.dev/features/preview-toolbar.md
- https://v0.app/docs/quickstart
- https://elements.ai-sdk.dev/components/web-preview
- https://cursor.com/changelog/3-0
