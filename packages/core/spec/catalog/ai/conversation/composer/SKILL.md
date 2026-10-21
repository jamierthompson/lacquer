---
name: lacquer-composer
description: The single most-used control in an AI product: a form with a growing textarea, slots for attachments and tools, and one primary control that is Send or Stop depending on the thread status.
---

# Composer (prompt input)

> The single most-used control in an AI product: a form with a growing textarea, slots for attachments and tools, and one primary control that is Send or Stop depending on the thread status.
>
> component · ai/conversation · tier 1 · organism · established · status: draft

Also called: PromptInput (AI Elements, prompt-kit), Composer (assistant-ui), CopilotTextarea (CopilotKit), st.chat_input (Streamlit), Open input (Shape of AI).

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## How to think about it

The composer is where the user talks, so it is the component people judge an
AI product by, and the mistake it most often makes is to think for itself.
A composer that shows a spinner because it sent a request, disables Send
because it is "busy", or clears the draft because something went wrong is
keeping its own private idea of the thread's state. That idea drifts. The
spec removes it: the composer receives `status` and renders from it,
exactly as the tool card and the thinking indicator do
(message-state-machine). Send becomes Stop because the status left `idle`,
and comes back because the status reached a terminal state. Nothing in the
composer knows whether a request exists.

## Three things it owns

The draft, the primary control and the keyboard contract between them.
Enter submits when there is something to submit and no turn is pending;
Shift+Enter is a newline; Esc stops. Everything else, attachments, the
toolbar, the disclaimer, is a slot, because the set of tools differs between
products and would otherwise become a prop list that no two products agree on.

## The control never moves

Send and Stop are one `<button>` element whose attributes change. Keeping the
element is what makes the focus rule free: if the user had focus on Send
when the turn started, they have focus on Stop now, in the same place, with
no announcement beyond the name change (LQ-COMPOSER-03). Swapping two
elements, or hiding one and showing another, drops focus to the body on the
exact keystroke a keyboard user is most likely to want it.

## Agent checklist

Before you emit a composer, confirm:

1. It takes the thread `status` as a prop and derives the primary control from it (LQ-COMPOSER-01).
2. Send and Stop are the same element in the same slot at the same size.
3. Enter is a no-op while a turn is pending, not a second submit and not a newline (LQ-COMPOSER-04).
4. Nothing clears the draft except an accepted submit; an error leaves it alone (LQ-COMPOSER-02).
5. The textarea is a native `<textarea>` with a name that is not its placeholder; the control has a verb-first aria-label.
6. The frame, the ring, the surface and the shadow read binding custom properties; no literal values.

## Use it when / not when

- Use: Any conversational or prompt-driven surface.
- Use: Inline "ask" panels in augmented products (density=compact).
- Avoid: A single-line search or command palette is the right mental model.
- Avoid: The input is a one-shot form field with no thread behind it; that is a textarea with a button.
- If it is a command or search bar that returns results rather than a turn → use `nl-command-bar`

Built from: `textarea`, `icon-button`.

Pairs with: `message-list`, `thinking-indicator`, `suggested-prompts`, `context-chips`, `model-mode-selector`, `mistakes-disclaimer`, `voice-input`, `tooltip`, `message-state-machine`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `root` | form | required | The form. Carries data-status (the thread status it renders from) and data-empty while the draft is empty; named by aria-label so it is a landmark. |
| `frame` |  | required | The raised surface, its border, shadow and the focus ring when the textarea inside has keyboard focus. Everything but the disclaimer sits in it. |
| `attachments` |  | optional | slot. Attachment header with previews and remove controls, above the textarea. Consumer-supplied. |
| `textarea` | textarea | required | The draft. A `textarea` (reuses textarea) in its autosize, borderless frame, one line growing to maxRows and then scrolling. The composer's accessible name lives here. |
| `footer` |  | required | The row beneath the textarea that holds the toolbar slot and the primary control. |
| `toolbar` |  | optional | slot. Attach, slash menu, mode and model selectors, dictation. Consumer-supplied; each is a labelled control in its own right. |
| `primary-control` | button | required | One icon-button (reuses icon-button) that is Send while the status is idle or terminal and Stop while it is submitted, streaming:* or awaiting-approval. Same slot, same size, so nothing moves when it swaps. Carries data-action="send \| stop". |
| `disclaimer` |  | optional | slot. One line beneath the form ("AI can make mistakes"). Consumer-supplied; see mistakes-disclaimer. |

## Variants

- **density**: full | compact (default `full`) — Full stacks the textarea above a footer row (toolbar and control), the shape of every chat product. Compact puts the control beside the textarea for inline "ask" panels inside a classic product; it has no toolbar slot.

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | Raised surface (color.bg.surface, shadow.sm) with a color.border.input border and radius.lg; the textarea is borderless inside it; the primary control is Send. | Default semantics; the form is a named landmark, the textarea has a name, the control has a name. |  |
| `hover` | Border one step to color.border.default. The textarea and control keep their own hover rules. | none |  |
| `focus-visible` | When the textarea has keyboard focus the whole container shows the ring (color.border.focus, focus.ring.width, focus.ring.offset), not the textarea alone; the primary control shows its own ring. | Implicit. Never outline none without a replacement (LQ-FOCUS-01). |  |
| `active` | none on the container; the primary control's active treatment applies (icon-button). | none (transient) |  |
| `disabled` | opacity.disabled on the whole form; textarea and control carry `disabled`; no hover or focus response. Used when there is no thread to send to, not to signal an empty draft. | `disabled` on the textarea and the control removes both from the tab order; aria-disabled on the form. |  |
| `empty` | Placeholder visible; the primary control is Send and soft-disabled (aria-disabled, kept focusable, opacity.disabled); pressing it does nothing. | aria-disabled="true" on the control; data-empty on the root; the placeholder is not the name. |  |
| `filled` | Placeholder gone; Send enabled in color.bg.primary; Enter submits. | aria-disabled removed from the control. |  |
| `submitted` | The primary control is Stop (square glyph, same slot and size) the moment the status leaves idle; nothing inside the composer spins or shimmers, the thinking indicator belongs to the message. The textarea stays editable so the next draft can be typed. | The control's accessible name changes to the stop string; the swap never moves focus (LQ-COMPOSER-03). The lifecycle announcement is the message's, not the composer's. |  |
| `streaming` | Stop stays, in every sub-state. Enter does not submit (LQ-COMPOSER-04); Esc stops. | Unchanged from submitted; no live region in the composer. |  |
| `awaiting-approval` | Stop stays; the composer does not take focus from the approval prompt. | Unchanged from submitted. |  |
| `error` | Send returns. Whatever is in the textarea stays (LQ-ERR-01, LQ-COMPOSER-02). The error and its Retry live in the message; the composer shows no error styling of its own. | none of its own; role="alert" belongs to the message's error. |  |

## Modes

Component-specific display modes. Same contract as states: a treatment and an a11y expression each.

| Mode | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `attachments-pending` | The attachments slot is rendered above the textarea with one preview per file and a remove control each; the form grows, the control does not move. | Adding or removing an attachment is announced politely from a role="status" region inside the slot. |  |

## API (framework-neutral)

| Prop | Type | Default | Maps to | Notes |
| --- | --- | --- | --- | --- |
| `status`* | `enum(idle\|submitted\|streaming:reasoning\|streaming:tool\|streaming:text\|awaiting-approval\|complete\|error\|cancelled)` |  | data-status | The thread status from message-state-machine. The primary control, Enter and Esc are derived from it and from nothing else (LQ-MACHINE-01). |
| `value` | `string` |  |  | The draft, when controlled. |
| `defaultValue` | `string` | `` |  | The initial draft, when uncontrolled. |
| `disabled` | `boolean` | `false` | disabled, aria-disabled |  |
| `placeholder` | `string` |  | placeholder | A hint, not the name. Default is the `placeholder` string. |
| `label` | `string` | `Message` | aria-label | The accessible name of the form and of the textarea. |
| `submitKey` | `enum(enter\|mod-enter)` | `enter` | aria-keyshortcuts | enter submits on Enter and inserts a newline on Shift+Enter; mod-enter submits on Cmd/Ctrl+Enter and lets Enter insert a newline. |
| `maxRows` | `number` | `8` |  | Lines the textarea grows to before it scrolls. |
| `clearOnSubmit` | `boolean` | `true` |  | Empty the draft when a submit is accepted. Never applies on error (LQ-COMPOSER-02). |
| `density` | `enum(full\|compact)` | `full` | data-density |  |
| `strings` | `Partial<Record<send\|stop\|placeholder, string>>` |  |  | Localised strings; the defaults are in `content.strings`. |

Slots: `attachments`, `toolbar`, `disclaimer`.
Events: `submit`, `stop`, `change`.

Interactions:
- Enter submits, Shift+Enter inserts a newline (submitKey=enter)
- Cmd/Ctrl+Enter submits, Enter inserts a newline (submitKey=mod-enter)
- Esc stops the current turn while it is pending
- Typing while a turn is pending is kept as the next draft

The composer owns three things: the draft, the primary control and the keyboard contract between them. Everything else, attachments, the toolbar, the disclaimer, is a slot the product fills with its own labelled controls, because the set of tools differs between products and must not be a prop list here. `status` is a prop because the composer never knows whether a request is in flight; the thread does, and the composer renders it (message-state-machine).

## Accessibility

- Role: form (the root, a landmark because it is named); textbox (the textarea); button (the control)
- Accessible name: The form and the textarea are both named by `label` ("Message") through aria-label. The primary control is named by the send or stop string through aria-label; the icon is decorative. The placeholder is never the name (LQ-NAME-01).
- `aria-label` on root, textarea = label
- `aria-label` on primary-control = strings.send | strings.stop when by status
- `aria-disabled` on primary-control = true when the draft is empty and the status is not pending
- `aria-keyshortcuts` on primary-control = Enter | Meta+Enter Control+Enter when by submitKey, while it is Send
- `disabled` on textarea, primary-control when disabled

| Key | Action |
| --- | --- |
| `Enter` | Submits the draft. (submitKey=enter, filled, status idle or terminal) |
| `Shift+Enter` | Inserts a newline. (submitKey=enter) |
| `Cmd/Ctrl+Enter` | Submits the draft. (submitKey=mod-enter, filled, status idle or terminal) |
| `Esc` | Stops the turn. (focus inside the composer and the status is pending) |
| `Tab` | Moves from the textarea through the toolbar to the primary control. Stop is at most one Tab from the textarea when the toolbar is empty. |

Focus: Focus stays in the textarea after a submit, so the next draft can be typed; the swap between Send and Stop never moves focus (LQ-COMPOSER-03). Stop never steals focus from an approval prompt.

Announcements: None of its own. The lifecycle announcements ("Thinking", "Response complete") belong to the message's status region (message-state-machine). The attachments slot announces add and remove via role="status".

## Tokens

Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.

Consumes: `color.bg.surface`, `color.border.input`, `color.border.default`, `color.border.focus`, `color.fg.default`, `color.fg.muted`, `radius.lg`, `shadow.sm`, `space.inset.sm`, `space.gap.sm`, `type.body.md`, `type.label.sm`, `focus.ring.width`, `focus.ring.offset`, `opacity.disabled`, `motion.duration.fast`, `motion.easing.standard`.

## Content

- Label: The control has no visible label; its name is a verb and an object ("Send message", "Stop generating").
- Voice: The placeholder invites, in one or two words ("Message…", "Ask anything"). It never explains the keyboard.
- Never: Never "Submit", "Go" or "Enter" as the control's name. Never a spinner, "Sending…" or a disabled Send while a turn is pending; the control is Stop then.
- Default strings: send="Send message", stop="Stop generating", placeholder="Message…"

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-STATE-01** (MUST) All five base states. Every interactive component implements enabled, hover, focus-visible, active and disabled with a defined visual treatment, including in dark mode.
  Fix: Add the missing state using the component's token deltas (see its states[] treatment).
- **LQ-STATE-03** (MUST) Every state reaches the accessibility tree. Every visible state has an ARIA expression or an explicit "none" in the spec; selected, expanded, invalid, busy and current are never visual-only.
  Fix: Set the attribute the APG pattern specifies; do not invent a new one.
- **LQ-SEM-01** (MUST) Native element first. Prefer the native element (button, a, select, details, input) until a product requirement makes it impossible; a div or span with a click handler and a role is a defect unless the spec names an exception.
  Fix: Replace with the native element; keep the styling.
- **LQ-NAME-01** (MUST) Every control has an accessible name. Every interactive element has an accessible name from content, a label, aria-label or aria-labelledby; placeholder text and title attributes do not count.
  Fix: Add visible text, a <label>, or aria-label for icon-only controls.
- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.
- **LQ-RECOVER-01** (MUST) Stop and regenerate always. Every generated message can be stopped while streaming and regenerated after it completes.
- **LQ-ERR-01** (MUST) Keep the input, offer Retry. Every error state preserves the user's input and offers Retry.
- **LQ-COMPOSER-01** (MUST) Send becomes Stop from the status. The primary control is Send while the status is idle or terminal and Stop while it is submitted, streaming:* or awaiting-approval, in the same slot at the same size; it reads the status and nothing else.
  Fix: Derive `action = isPending(status) ? "stop" : "send"` and render one icon-button from it.
- **LQ-COMPOSER-02** (MUST) The draft survives. Only an accepted submit clears the draft; an error, a stop, a status change or typing during a turn never does.
  Fix: Clear the draft inside the submit handler only, after the submit event fires.

### Forbidden

- **LQ-STATE-02** (MUST) No state by colour alone. No state is expressed by colour alone; every state has a second channel (icon, weight, border, position or text).
  Fix: Add an icon, border, weight or text change alongside the colour change.
- **LQ-FOCUS-01** (MUST) Never remove focus without replacing it. No `outline: none` / `outline-0` / `focus:outline-none` without a `:focus-visible` replacement that has ≥3:1 contrast against both the component and the page.
  Fix: Use `focus-visible:ring-2 ring-ring ring-offset-2` (or the binding's equivalent) and keep `:focus` untouched.
- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding's custom properties; no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`).
  Fix: Replace with the role's custom property from the binding (see spec/bindings/html.yaml).
- **LQ-COMPOSER-03** (MUST) No focus theft. Swapping Send for Stop, or back, never moves focus; a submit never moves focus out of the composer; the composer never takes focus while an approval prompt holds it.
  Fix: Keep one button element across the swap and change its attributes; focus the textarea after a submit, never a message.
- **LQ-COMPOSER-04** (MUST) No second turn while one is pending. Enter and the primary control never emit submit while the status is submitted, streaming:* or awaiting-approval; the only action available then is Stop. Queuing a draft is a product feature outside the composer.
  Fix: Gate the submit path on `!isPending(status)`; make Enter a no-op there, not a newline.

## Examples

- The same composer in idle and in streaming — `examples/html/send-becomes-stop.html` (state:filled, state:streaming, rule:LQ-COMPOSER-01)
- An errored turn with the draft still in place — `examples/html/draft-kept-on-error.html` (state:error, rule:LQ-COMPOSER-02, rule:LQ-ERR-01)
- Inline ask panel — `examples/html/compact.html` (variant:density=compact)
- ✗ Send shows a spinner and disables itself while streaming; there is no Stop — `examples/anti/loading-send.html` violates LQ-COMPOSER-01, LQ-RECOVER-01
- ✗ A div composer whose only name is the placeholder — `examples/anti/placeholder-as-name.html` violates LQ-NAME-01, LQ-SEM-01, LQ-ANAT-01

## Implementations

- html: `examples/html/composer.html` (reference)

## Exemplars

- ChatGPT — pill composer with + menu, tools and dictation; the control swaps to a stop square.
- AI Elements PromptInputSubmit — the send/stop icon follows `status`; adopt that, not a loading spinner.
- Claude — the draft typed during a turn is kept and sent next; nothing is lost on error.

## Sources

- https://elements.ai-sdk.dev/components/prompt-input
- https://www.assistant-ui.com/docs/primitives
- https://developer.apple.com/design/human-interface-guidelines/generative-ai
