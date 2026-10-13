---
name: lacquer-terminal-panel
description: Console output from agent-run commands, with exit status, ANSI colour and the same follow/release scrolling rule as chat.
---

# Terminal output panel

> Console output from agent-run commands, with exit status, ANSI colour and the same follow/release scrolling rule as chat.
>
> component · ai/agentic · tier 2 · established · status: draft

Also called: Terminal, StackTrace, TestResults, Snippet (AI Elements Code), integrated terminal (Cursor, VS Code), Bash tool output (Claude Code).

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: input-available, cancelled
- states.a11y: input-available, cancelled
- modes.treatment: exit-0, exit-nonzero, truncated
- modes.a11y: exit-0, exit-nonzero, truncated
- api.props
- accessibility.name
- rules.local (three or more, at least one forbid)
- examples.good
- examples.anti
- implementations

## Use it when / not when

- Use: coding agents and sandboxes
- Avoid: consumer products (summarise instead)

Built from: `code-block`, `scroll-area`, `badge`, `button`.

Pairs with: `tool-call-card`, `sandbox-browser-view`, `diff-review`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `header` |  | required | header: command, running/exit code |
| `ansi-coloured-monospace-output` |  | required | ANSI-coloured monospace output |
| `sticky-bottom-with-release` |  | required | sticky-bottom with release on scroll-up |
| `copy` |  | required | copy, clear, expand |
| `stack-traces` |  | required | stack traces with clickable paths |

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `input-available` | missing | missing |  |
| `cancelled` | missing | missing |  |

## Modes

Component-specific display modes. Same contract as states: a treatment and an a11y expression each.

| Mode | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `exit-0` | missing | missing |  |
| `exit-nonzero` | missing | missing |  |
| `truncated` | missing | missing |  |

## API (framework-neutral)

Interactions:
- stop
- copy
- open file from trace
- collapse

## Accessibility

- Accessible name: missing

Log region; exit status announced; output readable as text; colour not the only status signal.

## Tokens

Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.

Consumes: `type.family.mono`, `color.bg.code`, `color.status.success`, `color.status.error`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding's custom properties; no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`).
  Fix: Replace with the role's custom property from the binding (see spec/bindings/html.yaml).

## Exemplars

- AI Elements Terminal — ANSI colour support and auto-scroll (Jan 2026)

## Sources

- https://vercel.com/changelog/ai-code-elements
