---
name: lacquer-approval-prompt
description: The gate for a side-effecting action, inline in the turn: the exact payload, three rows of risk, and Allow once, Always allow (scoped) or Deny with a correction.
---

# Permission / approval prompt

> The gate for a side-effecting action, inline in the turn: the exact payload, three rows of risk, and Allow once, Always allow (scoped) or Deny with a correction.
>
> component · ai/agentic · tier 1 · organism · emerging · status: draft

Also called: Confirmation (AI Elements), permission prompt (Claude Code), terminal command approval (VS Code), sandbox access controls (Cursor), useHumanInTheLoop (CopilotKit), Intent Preview (Smashing), Controls (Shape of AI).

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## How to think about it

The approval prompt is the one place the loop stops and asks. Everything
about it follows from that: it must show exactly what will happen, it must
make the safe answer easy and the standing-rule answer deliberate, and it
must not take anything else away from the user while it waits. A prompt that
summarises the action, defaults to "always", or opens as a modal fails one
of those three, and each failure is a safety defect, not a style one.

## Exact, not summarised

The title is the action as the agent would say it, with the verb, the object
and the scope: "Delete dist/ (14 files) in this repo" (LQ-GATE-02). The
payload is what will actually run, verbatim: the command, the paths, the
request body (LQ-APPROVAL-01). The risk rows are three facts, what it
touches, whether it can be undone, how far it reaches. None of this is
warning copy; a user who reads the three rows should be able to decide
without reading anything else.

## The default follows the effect

Enter is the fast path. For a read or a write the fast path is Allow once;
for a destroy it is Deny (LQ-APPROVAL-02). Always allow is never the default
and never the focus (LQ-GATE-01), and it exists only when the rule it would
save can be stated in its own label, "Always allow npm test in this repo"
(LQ-APPROVAL-03). An unscoped "always" is a blank cheque with a friendly
name.

## Inline, and only the user answers

The prompt lives in the tool card's approval slot, in the turn, with no
scrim and no trap (LQ-APPROVAL-05). The composer's Stop is one Tab away and
still works, because the one thing a user must always be able to do is end
the turn. And nothing but the user resolves it: no timer, no transport event,
no default (LQ-APPROVAL-04). If a product times out, the answer is
"timed out, denied".

## Agent checklist

Before you emit an approval prompt, confirm:

1. The title has a verb, an object and a scope; the payload is verbatim (LQ-GATE-02, LQ-APPROVAL-01).
2. Initial focus is Allow once, or Deny for a destroy; never Always allow (LQ-APPROVAL-02).
3. Always allow is rendered only with a scope in its label, and never for a destroy (LQ-APPROVAL-03).
4. The decide event fires from the user's activation only; a time-out is a deny (LQ-APPROVAL-04).
5. No `role="dialog"`, no scrim, no focus trap; Esc denies, Tab leaves (LQ-APPROVAL-05).
6. The options are catalog buttons named "Allow once", "Always allow {scope}" and "Deny"; never "OK" or "Yes".

## Use it when / not when

- Use: Any action outside the sandbox or with external effect (delete, send, pay, deploy, post, overwrite).
- Use: Any destroy, every time, even under an always rule (LQ-GATE-01).
- Avoid: Reads inside the sandbox; prompting for them trains the user to press Allow without reading.
- Avoid: An always option that would grant more than the prompt showed.
- Avoid: A modal; the turn is paused, the page is not.
- If the decision is about the run's autonomy as a whole, not one action → use `autonomy-dial`
- If it confirms a destructive action outside an agent loop → use `alert-dialog`

Built from: `button`, `textarea`.

Pairs with: `tool-call-card`, `autonomy-dial`, `activity-log`, `undo-rollback`, `hitl-gate`, `composer`, `message-state-machine`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `root` | form | required | The prompt, inline in the turn, never a modal. Carries data-state (approval-requested \| approval-responded), data-effect (read \| write \| destroy) and, once responded, data-decision. Named by the title through aria-labelledby. |
| `title` |  | required | The action in plain language, with verb, object and scope ("Delete dist/ (14 files) in this repo", LQ-GATE-02). Carries role="alert" so entering approval-requested is the thread's one assertive announcement, "Approval needed: {title}". |
| `eyebrow` |  | required | The "Approval needed" kicker inside the title, so the announcement and the name both start with it. |
| `payload` | pre | required | What will run, verbatim: the command, the paths, the request body. Never a summary (LQ-APPROVAL-01). Carries data-format (command \| text); command is set in type.family.mono. |
| `risk` | dl | optional | Three short rows of fact, what it touches, whether it can be undone, how far it reaches. |
| `actions` |  | required | The decision row, in DOM order allow, always, deny. |
| `allow` | button | required | "Allow once" (reuses button). Primary for read and write, destructive emphasis for destroy. The form's submit, so Enter on the default focus allows. |
| `always` | button | optional | "Always allow {scope}" (reuses button). Rendered only when a scope is given and named with it (LQ-APPROVAL-03). Never the default focus (LQ-GATE-01). |
| `deny` | button | required | "Deny" (reuses button). The default focus when the effect is destroy (LQ-APPROVAL-02); Esc reaches it from anywhere in the prompt. |
| `correction` | textarea | optional | "What should it do instead?" (reuses textarea). Sent with Deny; Enter inside it denies with the text. One line, autosize. |
| `decision` |  | required | The one line that replaces the actions once responded ("Allowed once", "Always allowed: npm test", "Denied: use pnpm", "Timed out, denied"). role="status"; takes focus so it is not lost. |
| `autonomy` |  | optional | slot. A "switch to auto mode" or "don't ask for reads" control, consumer-supplied (autonomy-dial). |

## Variants

- **effect**: read | write | destroy (default `write`) — Drives data-effect, the edge colour (none, color.status.warning, color.status.error), the emphasis of Allow and the default focus (LQ-APPROVAL-02). Writes look different from reads without reading the payload (LQ-TOOL-02).

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `approval-requested` | Open. Title, payload, risk and the actions are visible; the edge is coloured by effect; the default option holds focus. Everything around it is paused; nothing is dimmed or covered. | The title is announced assertively once as "Approval needed: {title}". Focus moves to Allow once, or to Deny when the effect is destroy, never to Always allow. |  |
| `approval-responded` | Collapsed to one line: the title and the decision, with no edge, no box and no controls. The payload and risk are gone; the tool card's input still shows what ran. | The decision line is role="status" and is announced politely once; it takes focus (tabindex -1) if focus was inside the prompt and the line is visible, else the collapsing card's header does. |  |
| `enabled` | Base. The three buttons and the correction field are live. | Default semantics; the form is named by the title. |  |
| `hover` | The button under the pointer takes its own hover treatment (button); the prompt itself has none. | none |  |
| `focus-visible` | The ring on the focused button or on the correction field's frame (button, textarea). | Implicit. Never outline none without a replacement (LQ-FOCUS-01). |  |
| `active` | The pressed button's active treatment (button). | none (transient) |  |
| `disabled` | none. A prompt is never disabled; once responded the controls are gone. | none |  |

## Modes

Component-specific display modes. Same contract as states: a treatment and an a11y expression each.

| Mode | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `allow-once` | data-decision="allow-once"; the decision line reads "Allowed once" in color.status.success. | Announced politely once. |  |
| `allow-always` | data-decision="allow-always"; the line reads "Always allowed: {scope}", so the rule that was saved is visible. | Announced politely once, with the scope. |  |
| `deny` | data-decision="deny"; the line reads "Denied" in color.fg.muted. | Announced politely once. |  |
| `deny-with-correction` | data-decision="deny"; the line reads "Denied: {correction}", so the instruction the agent received is on the record. | Announced politely once, with the correction. |  |
| `timed-out` | data-decision="timed-out"; the line reads "Timed out, denied". A time-out is a deny, never an allow (LQ-APPROVAL-04). | Announced politely once. |  |

## API (framework-neutral)

| Prop | Type | Default | Maps to | Notes |
| --- | --- | --- | --- | --- |
| `state`* | `enum(approval-requested\|approval-responded)` |  | data-state | From the tool part's state (message-state-machine); never inferred. |
| `title`* | `string` |  |  | Verb, object and scope in one phrase (LQ-GATE-02). The accessible name of the form. |
| `payload` | `string` |  |  | What will run, verbatim. Required for write and destroy (LQ-APPROVAL-01). |
| `payloadFormat` | `enum(command\|text)` | `command` | data-format | command is monospace; text (an email body, a message) is body type. |
| `risk` | `{ touches?: string; reversible?: string; reach?: string }` |  |  | The three risk rows; each is rendered only when given. |
| `effect` | `enum(read\|write\|destroy)` | `write` | data-effect |  |
| `alwaysScope` | `string` |  |  | When given, the Always option is rendered and named "Always allow {alwaysScope}". Absent means no Always option (LQ-APPROVAL-03). |
| `decision` | `enum(allow-once\|allow-always\|deny\|timed-out)` |  | data-decision | Required when the state is approval-responded. |
| `correction` | `string` |  |  | The correction recorded with a deny, shown in the decision line. |
| `autoFocus` | `boolean` | `true` |  | Move focus to the default option on entering approval-requested (LQ-APPROVAL-02). Off when the product moves focus itself. |
| `strings` | `Partial<Record<needed\|allow\|always\|deny\|correction\|allowed\|allowed_always\|denied\|denied_with\|timed_out\|touches\|reversible\|reach, string>>` |  |  | Localised strings; the defaults are in `content.strings`. |

Slots: `autonomy`.
Events: `decide`.

Interactions:
- Enter on the default option allows once (read, write) or denies (destroy)
- Esc denies, from anywhere in the prompt
- Type a correction and press Enter to deny with it
- Tab moves through Allow once, Always allow, Deny, the correction field, the autonomy slot

The prompt owns the decision: the three options, the correction and the keyboard contract. The title, payload and risk rows are props because the grader reads them (LQ-GATE-02, LQ-APPROVAL-01); the Always option exists only as a function of its scope so an unscoped rule cannot be rendered. It is inline because the turn is paused, not the page: the composer's Stop stays reachable (LQ-APPROVAL-05). It normally lives in a tool card's approval slot (tool-call-card).

## Accessibility

- Role: form (root, named by the title); alert (title); status (decision)
- Accessible name: From the title through aria-labelledby on the form, so the name is "Approval needed: {title}".
- `aria-labelledby` on root = id of title
- `aria-describedby` on root = id of risk when risk is given
- `role` on title = alert when approval-requested
- `role` on decision = status when approval-responded
- `data-format` on payload = command | text

| Key | Action |
| --- | --- |
| `Enter` | Activates the focused option. On entering, the default option is focused, so Enter alone allows once (read, write) or denies (destroy). (focus on a button) |
| `Enter` | Denies with the typed correction. (focus in the correction field) |
| `Shift+Enter` | Inserts a newline. (focus in the correction field) |
| `Space` | Activates the focused option. (focus on a button) |
| `Esc` | Denies. (focus anywhere in the prompt) |
| `Tab` | Moves through Allow once, Always allow, Deny, the correction field, the autonomy slot. Nothing is trapped. |

Focus: On entering approval-requested, focus moves to Allow once, or to Deny when the effect is destroy, and never to Always allow (LQ-APPROVAL-02, LQ-GATE-01). On responding, the decision line takes focus (tabindex -1) if focus was inside the prompt, so it is not dropped to the body; when a tool card collapses around it, the card's header takes focus instead (tool-call-card). Nothing is trapped; the composer's Stop stays one Tab away (LQ-APPROVAL-05).

Announcements: The title is the thread's only assertive announcement, once, on entering approval-requested (message-state-machine). The decision line is announced politely once. Nothing else in the prompt is live.

## Tokens

Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.

Consumes: `color.status.warning`, `color.status.error`, `color.status.success`, `color.fg.default`, `color.fg.muted`, `color.bg.surface`, `color.bg.surface-tertiary`, `color.border.default`, `radius.md`, `radius.sm`, `space.inset.sm`, `space.gap.xs`, `space.gap.sm`, `type.body.md`, `type.label.sm`, `type.label.md`, `type.family.mono`.

## Content

- Label: The options are "Allow once", "Always allow {scope}" and "Deny"; verb-first, with the scope in the label (LQ-COPY-01).
- Voice: The title says what the agent will do, as the agent would say it, with the object and the scope. The risk rows are facts, not warnings.
- Never: Never "OK", "Yes", "Continue" or "Proceed" as an option. Never an Always option whose label does not say what it covers. Never a payload summarised as "a command".
- Default strings: needed="Approval needed", allow="Allow once", always="Always allow {scope}", deny="Deny", correction="What should it do instead?", allowed="Allowed once", allowed_always="Always allowed: {scope}", denied="Denied", denied_with="Denied: {correction}", timed_out="Timed out, denied", touches="Touches", reversible="Reversible", reach="Reach"

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-GATE-01** (MUST) Per-action approval for destructive actions. Destructive agent actions (delete, send, pay, deploy, post, overwrite) require explicit per-action approval with a preview; "always allow" may not be the default option or initial focus.
- **LQ-GATE-02** (MUST) Verb, object and scope. Every approval prompt names verb, object and scope in its primary text.
- **LQ-TOOL-02** (MUST) Writes look different from reads. Write and destructive tool calls are visually distinct from reads without expansion.
- **LQ-COPY-01** (SHOULD) Labels are verb-first and specific. Action labels start with a verb and name the object ("Save changes", "Delete 3 files"); never "OK", "Yes", "Submit" or "Click here" when a specific label is possible.
  Fix: Rewrite as verb + object, sentence case, ≤3 words where possible.
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
- **LQ-APPROVAL-01** (MUST) The exact payload, not a summary. The payload part shows verbatim what will run (the command, the paths, the body); a write or destroy prompt without a non-empty payload is a defect.
  Fix: Pass the command or body the tool will receive as `payload`; keep the humanised phrase for the title.
- **LQ-APPROVAL-02** (MUST) Default focus by effect. On entering approval-requested, focus moves to Allow once for read and write and to Deny for destroy; it never moves to Always allow.
  Fix: Focus the option by effect in the mount effect; keep DOM order allow, always, deny.

### Forbidden

- **LQ-STATE-02** (MUST) No state by colour alone. No state is expressed by colour alone; every state has a second channel (icon, weight, border, position or text).
  Fix: Add an icon, border, weight or text change alongside the colour change.
- **LQ-FOCUS-01** (MUST) Never remove focus without replacing it. No `outline: none` / `outline-0` / `focus:outline-none` without a `:focus-visible` replacement that has ≥3:1 contrast against both the component and the page.
  Fix: Use `focus-visible:ring-2 ring-ring ring-offset-2` (or the binding's equivalent) and keep `:focus` untouched.
- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding's custom properties; no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`).
  Fix: Replace with the role's custom property from the binding (see spec/bindings/html.yaml).
- **LQ-APPROVAL-03** (MUST) No always without a scope. The Always option is rendered only when a scope is given, its label names that scope, and the scope never exceeds what the payload shows.
  Fix: Pass `alwaysScope` only when the rule can be stated in the label ("npm test in this repo"); omit it otherwise.
- **LQ-APPROVAL-04** (MUST) Never answered by the transport. The decide event fires from the user's activation of an option, Enter or Esc, and from nothing else; no timer, transport message or default selects allow, and a time-out resolves to timed-out, which is a deny.
  Fix: Leave the prompt open until the user acts; if the product times out, respond with timed-out and treat it as denied.
- **LQ-APPROVAL-05** (MUST) Not a modal. The prompt is inline in the turn with no scrim, no focus trap and no role="dialog"; the composer's Stop and the rest of the page stay reachable while it waits.
  Fix: Render it in the tool card's approval slot; let alert-dialog handle confirmations outside an agent loop.

## Examples

- A destroy prompt with Deny focused and no Always option — `examples/html/destroy-default-deny.html` (state:approval-requested, variant:effect=destroy, rule:LQ-APPROVAL-02, rule:LQ-GATE-01)
- A write prompt whose Always option names its scope — `examples/html/always-scoped.html` (variant:effect=write, rule:LQ-APPROVAL-03, rule:LQ-GATE-02)
- The responded line for an always rule and for a denial with a correction — `examples/html/decided.html` (state:approval-responded, mode:allow-always, mode:deny-with-correction)
- ✗ Always allow is primary and focused; there is no payload — `examples/anti/always-is-default.html` violates LQ-GATE-01, LQ-APPROVAL-01, LQ-APPROVAL-02
- ✗ A modal "Allow this?" with an unscoped Always option — `examples/anti/modal-unscoped.html` violates LQ-APPROVAL-03, LQ-APPROVAL-05, LQ-GATE-02

## Implementations

- html: `examples/html/approval-prompt.html` (reference)
- react: `@lacquer/react#ApprovalPrompt` (reference)

## Exemplars

- Claude Code — offers "don't ask again" only when the prompt can show everything the rule would allow; never auto-approves protected paths; pauses auto mode after repeated blocks.
- AI Elements Confirmation — request/accepted/rejected wired to needsApproval; the responded line.
- NN/g — ChatGPT Agent "requested final approval before submitting the reservation".

## Sources

- https://code.claude.com/docs/en/permissions
- https://code.claude.com/docs/en/permission-modes
- https://elements.ai-sdk.dev/components/confirmation
- https://www.smashingmagazine.com/2026/02/designing-agentic-ai-practical-ux-patterns/
- https://www.nngroup.com/articles/
