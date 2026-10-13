---
name: lacquer-streaming-markdown
description: Renders partial markdown as it arrives without flashing, breaking or leaking unsafe HTML; styles open fences and tables deliberately.
---

# Streaming text + markdown renderer

> Renders partial markdown as it arrives without flashing, breaking or leaking unsafe HTML; styles open fences and tables deliberately.
>
> component · ai/conversation · tier 1 · established · status: draft

Also called: MessageResponse / Response (AI Elements), ResponseStream + Markdown (prompt-kit), Streamdown (Vercel), st.write_stream (Streamlit).

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: streaming, complete, error
- states.a11y: streaming, complete, error
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: any streamed model output
- Avoid: never render raw model HTML; never re-parse the whole string per token

Built from: `code-block`, `table`, `blockquote`, `link`, `image`, `list`.

Pairs with: `message`, `thinking-indicator`, `reduced-motion-streaming`, `live-region-strategy`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `incremental-parser` |  | required | incremental parser |
| `unterminated-block-styling` |  | required | unterminated-block styling |
| `caret` |  | required | caret |
| `code-block` |  | required | code block with header, language, filename, copy |
| `table-wrapper` |  | required | table wrapper with horizontal scroll |
| `math` |  | required | math (KaTeX) and Mermaid after fence close |
| `hardened-link` |  | required | hardened link and image handling |

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `streaming` | missing | missing |  |
| `complete` | missing | missing |  |
| `error` | missing | missing |  |

## API (framework-neutral)

Interactions:
- copy code
- link safety preview of full URL
- expand long code blocks

## Accessibility

- Accessible name: missing

Rendered region is not the live region; mirror sentence batches to a hidden status region; code blocks are pre/code with a labelled copy button.

## Tokens

Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.

Consumes: `type.body.md`, `type.family.mono`, `color.bg.code`, `stream.cursor-blink`, `stream.reveal-duration`, `size.measure.prose`, `color.fg.link`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding's custom properties; no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`).
  Fix: Replace with the role's custom property from the binding (see spec/bindings/html.yaml).

## Exemplars

- Streamdown — 'parses incomplete Markdown for prettier streaming', blocks unexpected-origin images/links
- AI Elements MessageResponse — GFM, math, smart streaming

## Sources

- https://streamdown.ai/
- https://elements.ai-sdk.dev/components/message
