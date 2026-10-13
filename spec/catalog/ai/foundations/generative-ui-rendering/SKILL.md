---
name: lacquer-generative-ui-rendering
description: Three tiers of model-driven UI, ordered by safety; the catalog supports tier 1 and 2 with its own components.
---

# Generative UI rendering policy

> Three tiers of model-driven UI, ordered by safety; the catalog supports tier 1 and 2 with its own components.
>
> method · ai/foundations · tier 2 · emerging · status: draft

Also called: static generative UI (AG-UI / useFrontendTool), declarative (A2UI, Open-JSON-UI), open-ended (MCP Apps, OpenAI Apps SDK iframes).

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: enabled
- states.a11y: enabled
- accessibility.name
- rules.local (three or more, at least one forbid)

## Use it when / not when

- Use: tool results that are better shown than told
- Avoid: rendering model-supplied HTML directly
- Avoid: letting generated UI change constantly (NN/g: consistency problems)

Built from: `card`, `list`, `form`, `iframe`.

Pairs with: `tool-call-card`, `ai-accent-token`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `tier-1` |  | required | tier 1: model selects and fills pre-built components (safest) |
| `tier-2` |  | required | tier 2: model emits a JSON spec rendered with the product's catalog (A2UI: 'Agents can only use pre-approved components') |
| `tier-3` |  | required | tier 3: sandboxed iframe apps with system fonts/colors and max two actions per card (Apps SDK) |
| `never-raw-model` |  | required | never raw model HTML in the page |

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

Rendered components inherit the system's accessible components; iframes titled; no nested scrolling.

## Tokens

Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.

Consumes: `color.accent.ai`, `color.bg.surface-raised`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

missing

## Exemplars

- CopilotKit (Jan 2026) — static vs declarative vs open-ended generative UI
- OpenAI Apps SDK — inline/fullscreen/PiP; system colors and fonts; 'Limit actions per card to two'

## Sources

- https://www.copilotkit.ai/blog/the-developer-s-guide-to-generative-ui-in-2026
- https://a2ui.org/
- https://developers.openai.com/apps-sdk/concepts/ui-guidelines
- https://www.nngroup.com/articles/generative-ui/
