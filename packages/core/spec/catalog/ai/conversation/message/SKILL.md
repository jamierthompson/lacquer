---
name: lacquer-message
description: The container for one turn: a right-aligned user bubble, or a full-width assistant article that carries the thread status as data-state and holds its parts in order.
---

# Message (user / assistant)

> The container for one turn: a right-aligned user bubble, or a full-width assistant article that carries the thread status as data-state and holds its parts in order.
>
> component · ai/conversation · tier 1 · organism · established · status: draft

Also called: Message (AI Elements, prompt-kit), UserMessage / AssistantMessage (assistant-ui), st.chat_message (Streamlit), gr.ChatMessage (Gradio).

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## How to think about it

A message is a container and a status. The parts inside it, the thinking
indicator, the tool cards, the streamed text, the actions, are children the
product supplies, and each of them already knows how to render from the
status it is given. What the container adds is the attribute that says which
turn this is and what state it is in, the one live region that tells a screen
reader what happened, and the note that marks a stopped turn. It does not
know what is inside it, and it does not look.

That last point is the rule. A message that reads its own text to decide
whether it is streaming (no closing fence, no full stop, a caret still
visible) has a second, private idea of the lifecycle, and it drifts from the
thread's. The status arrives as a prop and is written to `data-state`
unchanged (LQ-MESSAGE-01); every decision the message makes is a function of
it.

## One voice

A thread has many things that could announce: the indicator, each tool card,
the caret, the actions. If each has a live region, every transition is read
two or three times. The message owns the one polite region for the lifecycle
and keeps it to a phrase per transition, at most one per two seconds
(LQ-MESSAGE-02). The approval prompt is the exception by design: its title
is the thread's only assertive announcement, because it is the only state the
user must act on. Errors use `role="alert"` on the error, not on the message.

## The user's partial

Stop is the user's most important control, and what it must not do is
destroy. A cancelled turn keeps every part that had arrived and gains one
line, "Stopped" (LQ-MESSAGE-03). Error does the same with its inline error.
Nothing in a message is removed by a status change.

## Agent checklist

Before you emit a message, confirm:

1. It takes the thread `status` as a prop and writes it to `data-state`; nothing inside reads text to decide a state (LQ-MESSAGE-01).
2. One `role="status"` region per assistant message, visually hidden, throttled; none on user messages (LQ-MESSAGE-02).
3. Cancelled appends the note; error appends the error; nothing is cleared (LQ-MESSAGE-03).
4. The user message is the only bubble; the assistant is full width within `size.measure.prose` (LQ-MESSAGE-04).
5. The root is an `article` named "You said" or "Assistant said", not a `div` with a class.

## Use it when / not when

- Use: Any thread, one message per turn.
- Avoid: Symmetric bubble layouts that make assistant prose narrow and hard to read.
- Avoid: A single-shot generation surface with no turns; that is a generation-canvas, not a thread.

Pairs with: `message-list`, `thinking-indicator`, `tool-call-card`, `approval-prompt`, `streaming-markdown`, `message-actions`, `error-refusal-state`, `reasoning-disclosure`, `branch-picker`, `composer`, `message-state-machine`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `root` | article | required | The turn. Carries data-from (user \| assistant) and, on an assistant message, data-state (the thread status, written through unchanged). Named by aria-label ("You said", "Assistant said"). |
| `identity` |  | optional | slot. A name, avatar or AI label above the content. Consumer-supplied. A sparkle alone is not a label (LQ-STYLE-02). |
| `status` |  | optional | The turn's one polite live region, visually hidden, on assistant messages only. Its text is derived from the status and changes at most once per 2 s (LQ-A11Y-01). Nothing that counts lives in it. |
| `content` |  | required | slot. The parts in order, consumer-supplied: the thinking indicator, reasoning, tool cards (with an approval prompt inside one), streamed text, sources. Each renders from the status or a tool part's state, never from the text. |
| `note` |  | optional | One line after the content while data-state is cancelled ("Stopped"), so the partial output is marked and never cleared (LQ-MACHINE-03). |
| `actions` |  | optional | slot. The actions bar after the content, consumer-supplied (message-actions). A product renders it in terminal states; the message does not decide what is in it. |

## Variants

- **from**: user | assistant (default `assistant`) — User is a bubble at the end of the line, at most 70% wide. Assistant is full width, capped at size.measure.prose, with no bubble, so prose has a reading measure and tool cards have room.

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `submitted` | The content holds the thinking indicator and nothing else. No caret, no actions, no note. The article is already on screen so the slot does not jump when the first token lands. | The status region says "Thinking" once, or the activity the transport named. |  |
| `streaming` | The content grows in place as parts arrive, in order: reasoning, tool cards, text with a caret. Previously rendered parts never move (LQ-STREAM-02). No actions. | The status region says "Reasoning" or "Running {activity}" once on entering each sub-state; streamed text is announced in batches by streaming-markdown, at most one per 2 s (LQ-A11Y-01). |  |
| `awaiting-approval` | Nothing in the message changes; the approval prompt inside its tool card holds focus and the stream is paused. The message never scrolls or dims around it. | None from the message. The prompt's own alert is the thread's one assertive announcement. |  |
| `complete` | The caret is gone; the actions slot is rendered after the content. | The status region says "Response complete" once. |  |
| `error` | The pending indicator is gone; the inline error with Retry (error-refusal-state) renders in the content, after whatever had already arrived. The actions slot is rendered. | None from the status region; role="alert" sits on the error, not on the message (LQ-ERR-01). |  |
| `cancelled` | Everything already rendered stays exactly as it was; the note "Stopped" in color.fg.muted follows it (LQ-MACHINE-03). The actions slot is rendered so Regenerate is reachable (LQ-RECOVER-01). | The status region says "Stopped" once. |  |

## API (framework-neutral)

| Prop | Type | Default | Maps to | Notes |
| --- | --- | --- | --- | --- |
| `from` | `enum(user\|assistant)` | `assistant` | data-from |  |
| `status` | `enum(idle\|submitted\|streaming:reasoning\|streaming:tool\|streaming:text\|awaiting-approval\|complete\|error\|cancelled)` |  | data-state | The thread status from message-state-machine, required on an assistant message. Written to data-state unchanged and used for the announcement; never derived from the content (LQ-MESSAGE-01). Ignored on a user message. |
| `activity` | `string` |  |  | What the transport says it is doing, humanised ("Running npm test"). Used only in the status region's text while the status is submitted or streaming:tool. |
| `label` | `string` |  | aria-label | The accessible name. Defaults to the `you` or `assistant` string by `from`. |
| `strings` | `Partial<Record<you\|assistant\|thinking\|reasoning\|running\|tool\|complete\|stopped, string>>` |  |  | Localised strings; the defaults are in `content.strings`. |

Slots: `identity`, `content`, `actions`.

Interactions:
- none

The message owns the container, the status attribute, the announcement and the stopped note. Every visible part is a child, because the set of parts differs by product and by turn; the message does not know whether a tool card or a sources row is inside it. It receives the status rather than the message object because its only decisions, what to announce and whether to show the note, are functions of the status (message-state-machine).

## Accessibility

- Role: article (root); status (the status part)
- Accessible name: From aria-label on the root, "You said" or "Assistant said" by default, so a screen reader moving by article hears who is speaking before the content.
- `aria-label` on root = label
- `role` on status = status when from=assistant

Focus: Never takes focus and never moves it. The approval prompt inside a tool card moves focus by its own rule; nothing else in a message does.

Announcements: One polite status region per assistant message, visually hidden, whose text follows the status: "Thinking" (or the activity) on submitted, "Reasoning" and "Running {activity}" on entering those sub-states, "Response complete" on complete, "Stopped" on cancelled; silent in streaming:text, in awaiting-approval and in error, where streaming-markdown, the approval prompt's alert and the error's alert announce instead. Changes are throttled to one per 2 s (LQ-A11Y-01). Elapsed time is never in it (LQ-THINK-04).

## Tokens

Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.

Consumes: `color.bg.secondary`, `color.fg.on-secondary`, `color.fg.default`, `color.fg.muted`, `radius.lg`, `space.gap.xs`, `space.gap.sm`, `space.inset.sm`, `type.body.md`, `type.label.sm`, `size.measure.prose`.

## Content

- Label: The accessible name says who spoke ("You said", "Assistant said"); a product name may replace "Assistant".
- Voice: Announcements are one or two words that say what happened, never what the user should do.
- Never: Never "Loading", "Please wait" or "Generating response" in the status region; never a count-up.
- Default strings: you="You said", assistant="Assistant said", thinking="Thinking", reasoning="Reasoning", running="Running {activity}", tool="a tool", complete="Response complete", stopped="Stopped"

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.
- **LQ-NAME-01** (MUST) Every control has an accessible name. Every interactive element has an accessible name from content, a label, aria-label or aria-labelledby; placeholder text and title attributes do not count.
  Fix: Add visible text, a <label>, or aria-label for icon-only controls.
- **LQ-SEM-01** (MUST) Native element first. Prefer the native element (button, a, select, details, input) until a product requirement makes it impossible; a div or span with a click handler and a role is a defect unless the spec names an exception.
  Fix: Replace with the native element; keep the styling.
- **LQ-A11Y-01** (MUST) Polite, throttled live regions. Streaming regions use aria-live="polite" and announce status changes at most once per 2 s.
- **LQ-RECOVER-01** (MUST) Stop and regenerate always. Every generated message can be stopped while streaming and regenerated after it completes.
- **LQ-ERR-01** (MUST) Keep the input, offer Retry. Every error state preserves the user's input and offers Retry.
- **LQ-MESSAGE-01** (MUST) The status is on the container. An assistant message writes the thread status to data-state unchanged, and everything inside it renders from that status or from a tool part's state; the message never computes a state from its content.
  Fix: Pass the status in; see message-state-machine.
- **LQ-MESSAGE-02** (MUST) One status region per turn. An assistant message has exactly one role="status" region for the lifecycle, visually hidden, whose text is a function of the status and changes at most once per 2 s; the only other live regions inside it announce their own event once (the approval prompt's alert and decision, the error's alert).
  Fix: Give the message the region and take live regions off the indicator, the caret and the tool cards.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding's custom properties; no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`).
  Fix: Replace with the role's custom property from the binding (see spec/bindings/html.yaml).
- **LQ-STREAM-02** (MUST) No reflow beyond one line. Streaming must not reflow previously rendered content by more than one line height.
- **LQ-MESSAGE-03** (MUST) Nothing clears on stop or error. Entering cancelled or error never removes or replaces content already rendered; cancelled appends the stopped note and error appends the inline error.
  Fix: Render the note and the error after the content; never reset the content on a status change.
- **LQ-MESSAGE-04** (SHOULD) No bubble for the assistant. An assistant message is full width within size.measure.prose, with no bubble background; only the user message is a bubble.
  Fix: Drop the bubble from the assistant variant; keep the user bubble.

## Examples

- A user bubble and a complete assistant turn — `examples/html/user-and-assistant.html` (variant:from=*, state:complete, rule:LQ-MESSAGE-04)
- A stopped turn with its partial output and the note — `examples/html/cancelled-keeps-partial.html` (state:cancelled, rule:LQ-MESSAGE-03, rule:LQ-MACHINE-03)
- ✗ A message that decides it is streaming by reading its own text — `examples/anti/state-from-content.html` violates LQ-MESSAGE-01, LQ-MACHINE-01
- ✗ Stop replaces the partial output with a notice — `examples/anti/cleared-on-stop.html` violates LQ-MESSAGE-03, LQ-MACHINE-03

## Implementations

- html: `examples/html/message.html` (reference)
- react: `@lacquer/react#Message` (reference)

## Exemplars

- AI Elements Message — `from="user|assistant"` switches bubble vs full width; adopt the axis.
- ChatGPT, Claude — assistant text without a bubble and without an avatar; the measure does the work.
- Claude — a stopped turn keeps everything it had and adds one line; nothing is replaced.

## Sources

- https://elements.ai-sdk.dev/components/message
- https://www.assistant-ui.com/docs/primitives
- https://developer.apple.com/design/human-interface-guidelines/generative-ai
