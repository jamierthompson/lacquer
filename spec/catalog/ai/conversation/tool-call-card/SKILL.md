---
name: lacquer-tool-call-card
description: Collapsed-by-default card that shows one tool invocation with its seven-state lifecycle, inputs and outputs.
---

# Tool-call card

> Collapsed-by-default card that shows one tool invocation with its seven-state lifecycle, inputs and outputs.
>
> component · ai/conversation · tier 1 · organism · established · status: draft

Also called: Tool (AI Elements, prompt-kit), ToolUI / ToolFallback (assistant-ui), Step (Chainlit), tool rows (Cursor, Copilot, Claude Code), Footprints (Shape of AI).

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Use it when / not when

- Use: Any tool-using model or agent, one card per invocation, grouped when repeated.
- Avoid: Expanding every call by default (a wall of JSON).
- Avoid: Rendering model-supplied HTML as the output.
- Avoid: Showing a spinner without a name and target for more than 2 s (LQ-TOOL-01).
- If many steps over a long run that need scanning and jumping → use `activity-log`
- If the action needs a decision before it runs → use `approval-prompt`

Built from: `disclosure`, `badge`, `code-block`, `spinner`, `card`.

Pairs with: `reasoning-disclosure`, `approval-prompt`, `activity-log`, `agent-status`, `message-state-machine`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `root` |  | required | The card. Carries data-state (tool lifecycle) and data-effect (read \| write \| destroy). |
| `header` | button | required | The disclosure trigger. Whole row is pressable; aria-expanded lives here. |
| `icon` |  | optional | Tool-category glyph (search, file, terminal, browser). Decorative. |
| `name` |  | required | Humanised tool name plus target — "Searching the web for 'oklch contrast'", "Reading src/app.tsx". Never the raw function name. |
| `status` |  | required | State badge with text ("Running", "Completed", "Error"); colour is secondary. |
| `chevron` |  | required | Rotates on expand; rotation is paired with the header background change (LQ-STATE-02). |
| `body` |  | required | Collapsible region. Hidden by default except on error. |
| `input` |  | optional | Arguments as highlighted JSON in type.family.mono; truncated with "show all" past 20 lines. |
| `output` |  | optional | Result, error, or a registered generative-UI component. Never model-supplied HTML. |
| `actions` |  | optional | Retry (on error), Copy (on output), Approve / Deny (when approval-requested). |

## Variants

- **density**: row | card (default `row`) — Row is a single line with the summary (Claude Code style); card adds a visible border and padding. Grouped runs ("Searched 4 sources") are a row.
- **effect**: read | write | destroy (default `read`) — Drives data-effect and the status token so writes look different from reads without expansion (LQ-TOOL-02).
- Modifiers: grouped

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `input-streaming` | Status "Pending" in color.status.pending; name may still be arriving; shimmer on the name, opacity-only under reduced motion. | none until a name exists; then one announcement "Preparing {name}". |  |
| `input-available` | Status "Running" in color.status.running with a spinner; elapsed time after 10 s (LQ-WAIT-01). | aria-busy="true" on root; one polite announcement "Running {name}". |  |
| `approval-requested` | Body auto-expands; approval-prompt rendered inside; the card is outlined in color.status.warning. | Assertive announcement "Approval needed: {verb} {object}"; focus moves to the prompt. |  |
| `approval-responded` | Status "Approved" or "Denied"; the prompt collapses to one line recording the decision. | Polite announcement of the decision. |  |
| `output-available` | Status "Completed" in color.status.success; collapses to a one-line summary ("Read 3 files"); spinner removed. | aria-busy removed; one polite announcement "{name} complete". |  |
| `output-error` | Status "Error" in color.status.error with an icon; body auto-expands to show the message; Retry visible. | role="alert" on the message, not the whole card. |  |
| `output-denied` | Status "Denied" in color.fg.muted; no output; one line explaining who denied it. | Polite announcement. |  |
| `expanded` | Header background shifts one step; chevron rotates; body visible. | aria-expanded="true" on the header button; body has the header as aria-labelledby. |  |
| `focus-visible` | Ring on the header button and on each action. | Implicit. |  |
| `hover` | Header background one step. | none |  |
| `enabled` | Base. | none |  |
| `active` (opt.) | Header inset. | none |  |
| `disabled` (opt.) | none — a tool card is never disabled; it is denied or errored. | none |  |

## API (framework-neutral)

| Prop | Type | Default | Maps to | Notes |
| --- | --- | --- | --- | --- |
| `state`* | `enum(input-streaming\|input-available\|approval-requested\|approval-responded\|output-available\|output-error\|output-denied)` |  | data-state, aria-busy | Rendered from the tool machine, never inferred from content (message-state-machine). |
| `name`* | `string` |  |  | Humanised, with target. The implementation does not humanise; the caller does, so the mapping is one place. |
| `effect` | `enum(read\|write\|destroy)` | `read` | data-effect |  |
| `input` | `unknown` |  |  |  |
| `output` | `unknown \| node` |  |  | A registered component (a framework element, a custom element, a DOM node) may be passed for generative UI. |
| `error` | `string` |  |  |  |
| `defaultOpen` | `boolean` | `false` |  | Forced true by the implementation when state is output-error or approval-requested. |
| `onRetry` | `() => void` |  |  |  |
| `onApprove` | `() => void` |  |  |  |
| `onDeny` | `() => void` |  |  |  |

Slots: `icon`, `output`.
Events: `openChange`, `retry`, `approve`, `deny`.

Built from disclosure + badge + code-block + spinner + card. Output is a slot so a product can render its own component for a tool's result; the card never renders HTML strings.

## Accessibility

- APG pattern: [Disclosure](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/)
- Role: group (root), button (header), region (body)
- Accessible name: Root is labelled by the name part; the body is labelled by the header.
- `aria-expanded` on header = true | false
- `aria-controls` on header = id of body
- `aria-busy` on root = true when input-available
- `role` on error message = alert when output-error

| Key | Action |
| --- | --- |
| `Enter / Space` | Toggles the body. (focus on header) |
| `Tab` | Moves through header, then visible actions. Collapsed body contents are not in the tab order. |

Focus: On approval-requested, focus moves to the approval prompt's safe option (Deny). On output-error, focus does not move; the alert role announces.

Announcements: Exactly one announcement per state change, polite except approval-requested (assertive). Batched when several cards change within 2 s (LQ-A11Y-01).

## Tokens

Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.

Consumes: `color.status.pending`, `color.status.running`, `color.status.success`, `color.status.error`, `color.status.warning`, `color.bg.surface-secondary`, `color.fg.default`, `color.fg.muted`, `color.border.subtle`, `type.family.mono`, `type.body.md`, `type.label.sm`, `radius.md`, `space.inset.sm`, `space.gap.sm`, `motion.duration.base`.

## Content

- Label: Humanised verb + target. "Searching the web for 'x'", "Reading src/app.tsx", "Running npm test". Group repeats: "Searched 4 sources".
- Voice: Progressive while running ("Reading"), past tense when done ("Read 3 files"), plain on error ("Couldn't read src/app.tsx: permission denied").
- Never: Never the raw function name or a UUID in the visible name. Never "Processing…" without a target.
- Default strings: pending="Pending", running="Running", approval="Needs approval", approved="Approved", denied="Denied", completed="Completed", error="Error", retry="Retry", show_all="Show all"

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-STATE-03** (MUST) Every state reaches the accessibility tree. Every visible state has an ARIA expression or an explicit "none" in the spec; selected, expanded, invalid, busy and current are never visual-only.
  Fix: Set the attribute the APG pattern specifies; do not invent a new one.
- **LQ-SEM-01** (MUST) Native element first. Prefer the native element (button, a, select, details, input) until a product requirement makes it impossible; a div or span with a click handler and a role is a defect unless the spec names an exception.
  Fix: Replace with the native element; keep the styling.
- **LQ-NAME-01** (MUST) Every control has an accessible name. Every interactive element has an accessible name from content, a label, aria-label or aria-labelledby; placeholder text and title attributes do not count.
  Fix: Add visible text, a <label>, or aria-label for icon-only controls.
- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.
- **LQ-MOTION-02** (MUST) Reduced motion is honoured. Any transition longer than 150 ms or any looping animation has a `prefers-reduced-motion` branch that removes movement (opacity-only is fine).
  Fix: Add `motion-reduce:transition-none` / `motion-reduce:animate-none` or an equivalent media query.
- **LQ-TOOL-01** (MUST) Name the tool and its target. A tool call that takes more than 2 s shows its name and target (file, URL, query), not just a spinner.
- **LQ-TOOL-02** (MUST) Writes look different from reads. Write and destructive tool calls are visually distinct from reads without expansion.
- **LQ-DISCLOSE-01** (MUST) Collapsed by default. Reasoning, tool detail and sources are collapsed by default behind a one-line summary; expanding is the user's choice.
- **LQ-A11Y-01** (MUST) Polite, throttled live regions. Streaming regions use aria-live="polite" and announce status changes at most once per 2 s.
- **LQ-ERR-01** (MUST) Keep the input, offer Retry. Every error state preserves the user's input and offers Retry.
- **LQ-WAIT-01** (MUST) Indicator by 400 ms. Any pending agent response shows a visible indicator within 400 ms, a text status by 5 s, and elapsed time by 10 s.
- **LQ-TOOLCARD-01** (MUST) Render from state, not content. The card's visual state is driven by the `state` prop from the tool lifecycle; it is never inferred from the output text (e.g. "contains 'error'" or "ends with ```").
  Fix: Consume the machine's state; see message-state-machine.
- **LQ-TOOLCARD-02** (MUST) Error and approval auto-expand; everything else collapses. output-error and approval-requested open the body automatically; all other states are collapsed by default with a one-line summary visible.
  Fix: Derive `open` from state unless the user has toggled it.
- **LQ-TOOLCARD-04** (SHOULD) Group repeats. Three or more consecutive calls to the same tool collapse into one grouped card ("Searched 4 sources") with the individual calls inside.
  Fix: Group by tool name in the message renderer.

### Forbidden

- **LQ-STATE-02** (MUST) No state by colour alone. No state is expressed by colour alone; every state has a second channel (icon, weight, border, position or text).
  Fix: Add an icon, border, weight or text change alongside the colour change.
- **LQ-FOCUS-01** (MUST) Never remove focus without replacing it. No `outline: none` / `outline-0` / `focus:outline-none` without a `:focus-visible` replacement that has ≥3:1 contrast against both the component and the page.
  Fix: Use `focus-visible:ring-2 ring-ring ring-offset-2` (or the binding's equivalent) and keep `:focus` untouched.
- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding's custom properties; no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`).
  Fix: Replace with the role's custom property from the binding (see spec/bindings/html.yaml).
- **LQ-TOOLCARD-03** (MUST) Never render model HTML. Output is JSON, text, or a component registered by the product; a string from the model is never set as innerHTML.
  Fix: Render text, or map the tool name to a registered component.

## Examples

- One card per lifecycle state — `examples/html/seven-states.html` (state:*, rule:LQ-TOOLCARD-02)
- A read and a write side by side — `examples/html/write-vs-read.html` (variant:effect=*, rule:LQ-TOOL-02)
- ✗ Deciding the state by searching the output for "error" — `examples/anti/infer-state-from-output.html` violates LQ-TOOLCARD-01, LQ-TOOLCARD-03

## Implementations

- html: `examples/html/tool-call-card.html` (reference)

## Exemplars

- AI Elements Tool — the seven-state vocabulary with badges; adopt the names, collapse completed by default.
- Claude Code — one-line tool summaries in the transcript; the row density variant.
- CopilotKit — tool result rendered as a registered React component; the output slot.

## Sources

- https://elements.ai-sdk.dev/components/tool
- https://docs.chainlit.io/concepts/step
- https://docs.copilotkit.ai/
- https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
