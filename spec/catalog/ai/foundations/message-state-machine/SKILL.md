---
name: lacquer-message-state-machine
description: Name the assistant-turn lifecycle once and make every AI component render from it; it is the first thing to build.
---

# Message state machine

> Name the assistant-turn lifecycle once and make every AI component render from it; it is the first thing to build.
>
> principle · ai/foundations · tier 1 · established · status: draft

Also called: AI SDK status: submitted / streaming / ready / error, assistant-ui running state, Tool states: input-streaming … output-denied.

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## Missing

- states.treatment: idle, submitted, streaming, awaiting-approval, complete, error, cancelled
- states.a11y: idle, submitted, streaming, awaiting-approval, complete, error, cancelled
- rules.local (three or more, at least one forbid)

## Use it when / not when

- Use: Always, before any other AI component.
- Avoid: Inferring state from content (e.g. "ends with ```" means streaming).

Pairs with: `stop-regenerate-always`, `live-region-strategy`, `composer`, `message`, `tool-call-card`.

## Lifecycle

Initial state: `idle`.

| State | User sees | Composer | Announcement |
| --- | --- | --- | --- |
| `idle` | Nothing pending. | Send (disabled if empty) | none |
| `submitted` | User message rendered; assistant slot shows the thinking indicator. | Stop | "Thinking" (once) |
| `streaming:reasoning` | Reasoning disclosure open and shimmering. | Stop | "Reasoning" (once) |
| `streaming:tool` | Tool card in input-available. | Stop | "Running {tool}" (once per tool) |
| `streaming:text` | Markdown renders progressively with a caret. | Stop | Batched sentences, at most one per 2 s (LQ-A11Y-01). |
| `awaiting-approval` | Approval prompt; everything else paused. | Stop | Assertive: "Approval needed: {action}" |
| `complete` (terminal) | Actions bar appears; caret removed. | Send | "Response complete", then focus rules. |
| `error` (terminal) | Inline error state with Retry; the user's input is preserved. | Send | role="alert" |
| `cancelled` (terminal) | Partial output kept, marked "Stopped". | Send | "Stopped" |

Transitions: idle →(send) submitted; submitted →(reasoning-delta) streaming:reasoning; submitted →(tool-input-start) streaming:tool; submitted →(text-delta) streaming:text; streaming:reasoning →(tool-input-start) streaming:tool; streaming:reasoning →(text-delta) streaming:text; streaming:tool →(approval-requested) awaiting-approval; awaiting-approval →(approval-responded) streaming:tool; streaming:tool →(text-delta) streaming:text; streaming:tool →(tool-input-start) streaming:tool; streaming:text →(tool-input-start) streaming:tool; streaming:text →(finish) complete; streaming:tool →(finish) complete; submitted →(error) error; streaming:reasoning →(error) error; streaming:tool →(error) error; streaming:text →(error) error; submitted →(stop) cancelled; streaming:reasoning →(stop) cancelled; streaming:tool →(stop) cancelled; streaming:text →(stop) cancelled; awaiting-approval →(stop) cancelled; complete →(regenerate) submitted; error →(retry) submitted; cancelled →(regenerate) submitted.

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `idle` | missing | missing |  |
| `submitted` | missing | missing |  |
| `streaming` | missing | missing | Sub-states reasoning \| tool \| text are rendered by different components but share one composer control. |
| `awaiting-approval` | missing | missing |  |
| `complete` | missing | missing |  |
| `error` | missing | missing |  |
| `cancelled` | missing | missing |  |

## API (framework-neutral)

Expose one `status` value per thread and one `state` per tool part, from the transport (AI SDK `status`, assistant-ui `isRunning`, or your own reducer). Components receive it as a prop. No component may compute its state from message text.

## Accessibility

- Accessible name: Not applicable; this principle defines the announcements other components make.

Announcements: Each transition maps to exactly one announcement, listed per state above. Streaming text is batched. Approval is the only assertive announcement.

## Tokens

Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.

Defines: `color.status.pending`, `color.status.running`, `color.status.success`, `color.status.error`, `color.status.warning`.

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-RECOVER-01** (MUST) Stop and regenerate always. Every generated message can be stopped while streaming and regenerated after it completes.
- **LQ-ERR-01** (MUST) Keep the input, offer Retry. Every error state preserves the user's input and offers Retry.
- **LQ-A11Y-01** (MUST) Polite, throttled live regions. Streaming regions use aria-live="polite" and announce status changes at most once per 2 s.
- **LQ-MACHINE-01** (MUST) One lifecycle, consumed everywhere. Every AI component's visual state is a pure function of the thread status or a tool part's state; no component inspects message text to decide how to render.
  Fix: Pass the status down; see tool-call-card for the shape.
- **LQ-MACHINE-02** (MUST) Stop in every non-idle state, Regenerate in every terminal state. Stop is wired while status is submitted, streaming:* or awaiting-approval; Regenerate and Edit-and-resend are wired in complete, error and cancelled.
  Fix: Derive the composer's primary control from status.
- **LQ-MACHINE-03** (MUST) Cancel keeps the partial. Stopping a stream keeps the partial output on screen, marked as stopped; it is never cleared.
  Fix: Transition to cancelled, do not reset the message.

## Exemplars

- AI Elements Tool — seven states with badge labels.
- AI Elements PromptInputSubmit — the send/stop icon follows status.

## Sources

- https://elements.ai-sdk.dev/components/tool
- https://elements.ai-sdk.dev/components/prompt-input
- https://developer.apple.com/design/human-interface-guidelines/generative-ai
