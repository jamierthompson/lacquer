---
name: lacquer-reduced-motion-streaming
description: Three sanctioned streaming animations, each with a token and a reduced-motion fallback; decorative gradient animation is prohibited.
---

# Streaming motion tokens and reduced-motion behaviour

> Three sanctioned streaming animations, each with a token and a reduced-motion fallback; decorative gradient animation is prohibited.
>
> method · ai/foundations · tier 1 · emerging · status: draft

Also called: cursor blink, chunk fade-in, shimmer, prefers-reduced-motion.

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: enabled
- states.a11y: enabled
- accessibility.name
- rules.local (three or more, at least one forbid)

## Use it when / not when

- Use: any streaming UI
- Avoid: per-token fades
- Avoid: typewriter that slows already-received text
- Avoid: animated AI gradients

Pairs with: `streaming-markdown`, `thinking-indicator`, `ai-accent-token`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `stream-cursor-blink` |  | required | --stream-cursor-blink: 1 s step blink → static bar |
| `stream-reveal-duration` |  | required | --stream-reveal-duration: 120–200 ms opacity per chunk → 0 ms |
| `shimmer-duration` |  | required | --shimmer-duration: 1.5–2 s sweep → static muted text |
| `no-per-token-fades` |  | required | no per-token fades; no transform on text; scroll-behavior auto while streaming |

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

Respects prefers-reduced-motion; avoids strobing at high token rates (WCAG 2.2.2 spirit).

## Tokens

Roles, not values. A role is a token path in spec/tokens; the html binding reads it as `--lq-<role-with-dashes>`, the tailwind binding as an `lq-` utility (dist/bindings.json has both).

Consumes: `stream.cursor-blink`, `stream.reveal-duration`, `shimmer.duration`, `motion.reduce`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

missing

## Exemplars

- Streamdown — built-in caret indicators and smooth animations
- Jim Nielsen (2026) — shimmer text is useful; decorative tropes are not

## Sources

- https://streamdown.ai/
- https://www.explainx.ai/blog/ai-aesthetic-design-patterns-jim-nielsen-2026
