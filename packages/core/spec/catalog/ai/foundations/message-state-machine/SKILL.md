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

## How to think about it

An assistant turn is a small state machine, and every AI component on the
screen is a view of one value from it. The composer's Send becomes Stop because
the status left `idle`, not because a request is in flight somewhere. The
thinking indicator appears because the status is `submitted`, not because the
message body is empty. The tool card spins because the status is
`streaming:tool`, not because the output does not yet contain a closing fence.
When the status is the only input, every component agrees with every other one
by construction, and the one place that can be wrong is the table.

So write the table first. The transitions in this spec are the whole contract:
a list of `(from, on) → to` rows, nine statuses, eleven events. A reducer over
that table is a lookup, and an event with no row is a no-op. That is deliberate.
The moment an implementation adds a branch beside the table to handle a case
the table did not anticipate, there is a tenth status the spec does not know
about, and every component downstream renders it wrong (LQ-MACHINE-04).

## Where the status comes from

The transport owns it. The AI SDK calls it `status` (`submitted | streaming |
ready | error`); assistant-ui exposes `isRunning`; a custom backend has a
reducer. Lacquer names the sub-states of `streaming` because they render as
different components, but the composer control does not care which sub-state
it is in: anything that is not `idle` and not terminal shows Stop
(LQ-MACHINE-02).

Hold the status in one place and derive everything else. A separate
`isLoading` flag next to it is a second source of truth that will disagree
with the first the day a transition is added (LQ-MACHINE-05).

## Approval pauses the loop

`awaiting-approval` is the one state the transport cannot leave on its own. The
stream stops, the prompt takes focus, and the only way forward is the user's
decision. A transport that answers its own approval prompt is the anti-pattern
LQ-GATE-01 exists to forbid, so a test harness for this machine must pause
there too.

## Agent checklist

Before you render anything in an AI thread, confirm:

1. There is one `status` per thread, from the transport, and components receive it as a prop.
2. No component reads message text to decide its state (LQ-MACHINE-01).
3. Stop is wired in every non-idle, non-terminal state; Regenerate in every terminal one (LQ-MACHINE-02).
4. Stop transitions to `cancelled` and keeps the partial output (LQ-MACHINE-03).
5. The reducer is a lookup in the transitions table and nothing else (LQ-MACHINE-04).
6. No `isLoading` or `done` boolean lives beside the status (LQ-MACHINE-05).

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

Transitions: idle →(send) submitted; submitted →(reasoning-delta) streaming:reasoning; submitted →(tool-input-start) streaming:tool; submitted →(text-delta) streaming:text; streaming:reasoning →(tool-input-start) streaming:tool; streaming:reasoning →(text-delta) streaming:text; streaming:tool →(approval-requested) awaiting-approval; awaiting-approval →(approval-responded) streaming:tool; streaming:tool →(text-delta) streaming:text; streaming:tool →(tool-input-start) streaming:tool; streaming:text →(tool-input-start) streaming:tool; streaming:text →(finish) complete; streaming:tool →(finish) complete; submitted →(error) error; streaming:reasoning →(error) error; streaming:tool →(error) error; streaming:text →(error) error; submitted →(stop) cancelled; streaming:reasoning →(stop) cancelled; streaming:tool →(stop) cancelled; streaming:text →(stop) cancelled; awaiting-approval →(stop) cancelled; complete →(regenerate) submitted; error →(retry) submitted; cancelled →(regenerate) submitted; complete →(send) submitted; error →(send) submitted; cancelled →(send) submitted.

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `idle` | Nothing pending. No assistant slot is rendered; the composer shows Send, disabled while the draft is empty. | none |  |
| `submitted` | The user message is rendered and the assistant slot shows the thinking indicator; the composer shows Stop. | One polite announcement, "Thinking". |  |
| `streaming` | The sub-state picks the component. reasoning opens the reasoning disclosure, tool renders a tool card in input-available, text renders markdown progressively with a caret. The composer shows Stop throughout. | One polite announcement on entering each sub-state ("Reasoning", "Running {tool}"); text is batched into sentences, at most one announcement per 2 s (LQ-A11Y-01). | Sub-states reasoning \| tool \| text are rendered by different components but share one composer control. |
| `awaiting-approval` | The approval prompt is shown and everything else pauses, including the stream; the composer still shows Stop, because the turn is not over. | The only assertive announcement, "Approval needed: {action}". Focus moves to the prompt's safe option. |  |
| `complete` | The caret is removed and the actions bar appears; the composer returns to Send. | Polite "Response complete", then the message's focus rules apply. |  |
| `error` | An inline error with Retry replaces the assistant slot's pending indicator; the user's draft is preserved (LQ-ERR-01); the composer shows Send. | role="alert" on the error message, not on the whole message. |  |
| `cancelled` | Partial output stays on screen, marked "Stopped" (LQ-MACHINE-03); the composer shows Send. | Polite "Stopped". |  |

## API (framework-neutral)

Events: `send`, `reasoning-delta`, `tool-input-start`, `approval-requested`, `approval-responded`, `text-delta`, `finish`, `error`, `stop`, `retry`, `regenerate`.

Expose one `status` value per thread and one `state` per tool part, from the transport (AI SDK `status`, assistant-ui `isRunning`, or your own reducer). Components receive it as a prop. No component may compute its state from message text. The reducer is a lookup in the transitions table above: the status only changes on a listed (from, on) pair, and every other event is ignored (LQ-MACHINE-04). The React implementation will ship the table in its own file, with a test that asserts it equals this one, so the code cannot drift from this file.

## Accessibility

- Accessible name: Not applicable; this principle defines the announcements other components make.

Announcements: Each transition maps to exactly one announcement, listed per state above. Streaming text is batched. Approval is the only assertive announcement.

## Tokens

Roles, not values. A role is a token path in spec/tokens; the html binding reads it as `--lq-<role-with-dashes>`, the tailwind binding as an `lq-` utility (dist/bindings.json has both).

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

### Forbidden

- **LQ-MACHINE-04** (MUST) No transition outside the table. The status changes only through a row of the transitions table; an event with no row for the current status is ignored, never handled by an extra branch beside the table.
  Fix: Add the row to the spec first, then the table follows. Never the other way round.
- **LQ-MACHINE-05** (MUST) No second source of truth for the lifecycle. A thread holds one status value; no `isLoading`, `isStreaming` or `done` flag lives beside it that could disagree with it.
  Fix: Derive the boolean from status at the point of use (`status !== "idle" && !terminal`).

## Exemplars

- AI Elements Tool — seven states with badge labels.
- AI Elements PromptInputSubmit — the send/stop icon follows status.

## Sources

- https://elements.ai-sdk.dev/components/tool
- https://elements.ai-sdk.dev/components/prompt-input
- https://developer.apple.com/design/human-interface-guidelines/generative-ai
