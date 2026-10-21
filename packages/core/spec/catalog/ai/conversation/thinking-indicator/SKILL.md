---
name: lacquer-thinking-indicator
description: Shimmering status text ("Thinking", "Searching the web") in the assistant slot while the status is submitted; specific text over anonymous dots, gone at the first token.
---

# Thinking indicator

> Shimmering status text ("Thinking", "Searching the web") in the assistant slot while the status is submitted; specific text over anonymous dots, gone at the first token.
>
> component · ai/conversation · tier 1 · atom · established · status: draft

Also called: Shimmer (AI Elements; Loader deprecated 1.8.2), Loader (prompt-kit), Shimmering thinking text (ChatGPT, Claude, Cursor), typing dots.

> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.

## How to think about it

The indicator fills the gap between the user's send and the model's first
token, and the whole design question is what to put in that gap. Dots say
"something is happening". Text says what. "Searching the web for 'oklch
contrast'" costs nothing more to render than three dots and tells the user
the request was understood, which is the thing they are actually waiting to
learn. So the text is the component and the dot is decoration; the generic
"Thinking" is the fallback for when the transport has not said anything more
specific (LQ-THINK-01).

## It exists because the status says so

The indicator renders when the thread status is `submitted` and in no other
status. It does not check whether the message body is empty, because an
empty body is also what a cancelled turn with no output looks like. When
the first reasoning, tool or text event arrives the status changes and the
indicator is gone, with no fade and no placeholder height, because the
component that replaces it is already there (LQ-THINK-02).

## Who speaks

A thread has one status region, owned by the message. The indicator is not
a second one. If it were, "Thinking" would be announced twice, and the
elapsed counter, which is useful to see and intolerable to hear, would tick
through a screen reader every second (LQ-THINK-04). So the indicator is
plain content, and the product hands the same status text to the message's
region, throttled to one announcement per two seconds (LQ-A11Y-01).

## Agent checklist

Before you emit a thinking indicator, confirm:

1. It is rendered from `status === "submitted"` and nothing else.
2. It shows text; a specific status when the transport has one, "Thinking" otherwise.
3. Elapsed time appears by 10 s (LQ-WAIT-01) and is outside every live region.
4. The shimmer and the pulse stop under `prefers-reduced-motion` and the text stays.
5. It has no `aria-live` or `role="status"` of its own.

## Use it when / not when

- Use: Any latency between submit and the first token, tool or reasoning event; that is, whenever the status is submitted.
- Avoid: After content has arrived; the shimmer stops at the first token.
- Avoid: As a fake delay to look busy.
- Avoid: Inside a tool card; the card has its own pending state.

Pairs with: `composer`, `message`, `streaming-markdown`, `reasoning-disclosure`, `latency-patterns`, `reduced-motion-streaming`, `live-region-strategy`, `message-state-machine`.

## Anatomy

Parts in DOM order; each renders with `data-slot="<part>"`.

| Part | Element | Req. | Notes |
| --- | --- | --- | --- |
| `root` |  | required | The indicator. Carries data-mode (thinking \| specific-status) and data-elapsed once elapsed time is shown. Not a live region; the message's status region does the announcing. |
| `dot` |  | optional | A pulsing dot before the text. Decorative (aria-hidden); static under reduced motion. |
| `status-text` |  | required | What the assistant is doing, as text, either the generic string or the caller's specific status. The shimmer sweeps across this text and only this text. |
| `elapsed` |  | optional | Seconds since the turn was submitted, shown after 5 s ("12s"). Outside any live region so it is never read aloud as a count-up (LQ-THINK-04). |

## States

Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.

| State | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `enabled` | Status text in color.fg.muted with a shimmer sweep to shimmer.highlight over shimmer.duration; the dot pulses on the same clock. Under prefers-reduced-motion the text is static in color.fg.muted and the dot is still (LQ-MOTION-01). | none of its own. The message's status region announces "Thinking" once on submitted and the specific text when it changes, at most once per 2 s (LQ-A11Y-01); the indicator itself is plain content. |  |

## Modes

Component-specific display modes. Same contract as states: a treatment and an a11y expression each.

| Mode | Treatment | A11y | Notes |
| --- | --- | --- | --- |
| `thinking` | The generic string ("Thinking") when the transport has nothing more specific to say. | Announced once by the message's status region as "Thinking". |  |
| `specific-status` | The caller's text ("Searching the web for 'oklch contrast'", "Reading 4 files"); same shimmer. The text may change while the status stays submitted. | Each change is announced by the message's status region, throttled (LQ-A11Y-01). |  |
| `hidden` | Not rendered at all, with no placeholder height and no fade. The first token, tool or reasoning event replaces it (LQ-THINK-02). | none; nothing announces the removal, the next component's announcement follows. |  |

## API (framework-neutral)

| Prop | Type | Default | Maps to | Notes |
| --- | --- | --- | --- | --- |
| `status`* | `enum(idle\|submitted\|streaming:reasoning\|streaming:tool\|streaming:text\|awaiting-approval\|complete\|error\|cancelled)` |  | rendered \| not rendered | The thread status from message-state-machine. The indicator renders in submitted and in no other status. |
| `label` | `string` |  | data-mode | The specific status, when the transport knows one. Absent means the generic string and data-mode="thinking". |
| `elapsedAfter` | `number` | `5000` |  | Milliseconds before the elapsed part appears. LQ-WAIT-01 requires it by 10 s. |
| `strings` | `Partial<Record<thinking, string>>` |  |  | Localised strings; the default is in `content.strings`. |

Interactions:
- none

The indicator is text. It takes the status so it can decide whether to exist, and a label so the product can say what is happening; it never reads message content to decide either (LQ-MACHINE-01). It has no live region of its own because a thread has exactly one status region, owned by the message (live-region-strategy); giving every pending component its own would announce the same event twice.

## Accessibility

- Role: none. The status text is content; the dot is aria-hidden; the elapsed part is content outside any live region.
- Accessible name: Not applicable. The status text is read in place. The announcement comes from the message's status region, which receives the same text.
- `aria-hidden` on dot = true

Focus: Never focusable; focus must not be lost when it is replaced by the first token.

Announcements: None of its own. The message's status region announces "Thinking" once on submitted and each specific status change at most once per 2 s (LQ-A11Y-01). Elapsed time is never announced.

## Tokens

Roles, not values. A role is a token path in spec/tokens; the html binding reads it as `--lq-<role-with-dashes>`, the tailwind binding as an `lq-` utility (dist/bindings.json has both).

Consumes: `color.fg.muted`, `shimmer.duration`, `shimmer.highlight`, `type.body.md`, `type.label.sm`, `space.gap.sm`, `size.icon.sm`, `motion.duration.base`.

## Content

- Label: Progressive verb plus object when specific ("Searching the web", "Reading 4 files"); the generic string otherwise.
- Voice: Says what is happening, not that the user should wait. Sentence case, no ellipsis in the string itself.
- Never: Never "Processing", "Loading", "Please wait" or "Generating response"; never a count-up read aloud.
- Default strings: thinking="Thinking"

## Rules

What the grader enforces. MUST = defect, SHOULD = deduction.

### Required

- **LQ-ANAT-01** (SHOULD) Parts are addressable. Every anatomy part renders with `data-slot="<part>"` so docs, tests and the grader can target it without classes.
  Fix: Add data-slot to the part's root element.
- **LQ-WAIT-01** (MUST) Indicator by 400 ms. Any pending agent response shows a visible indicator within 400 ms, a text status by 5 s, and elapsed time by 10 s.
- **LQ-MOTION-01** (MUST) Reduced motion branch. Thinking and streaming animations degrade under prefers-reduced-motion.
- **LQ-MOTION-02** (MUST) Reduced motion is honoured. Any transition longer than 150 ms or any looping animation has a `prefers-reduced-motion` branch that removes movement (opacity-only is fine).
  Fix: Add `motion-reduce:transition-none` / `motion-reduce:animate-none` or an equivalent media query.
- **LQ-A11Y-01** (MUST) Polite, throttled live regions. Streaming regions use aria-live="polite" and announce status changes at most once per 2 s.
- **LQ-THINK-01** (MUST) Specific over generic. When the transport knows what it is doing (a tool, a phase, a target) the status text says so; the generic string is the fallback, never the default while specifics are available.
  Fix: Pass the humanised tool or phase name as `label`.
- **LQ-THINK-02** (MUST) Gone at the first token. The indicator is rendered only while the status is submitted; it is removed on the first reasoning, tool or text event and never sits beside streamed content.
  Fix: Render it from `status === "submitted"` and from nothing else.

### Forbidden

- **LQ-TOKEN-01** (MUST) No literal values. Component styles read token roles only, through the binding (its custom properties or its utility classes); no literal colours, radii, shadows, durations or z-indexes (`#7c3aed`, `oklch(…)`, `border-radius: 12px`, `z-index: 50`, `300ms`, `bg-zinc-900`, `rounded-lg`).
  Fix: Replace with the role's `--lq-*` property or its `lq-` utility class; both are derived from the role's path in spec/tokens (see dist/bindings.json).
- **LQ-THINK-03** (MUST) No anonymous dots. Three pulsing dots, a bare spinner or a bar is never the whole indicator; the status text is always present and the dot is a companion to it.
  Fix: Add the text; keep the dot if you like it.
- **LQ-THINK-04** (MUST) Elapsed time is not announced. The elapsed part lives outside every live region, so a screen reader never hears a counter tick.
  Fix: Keep the indicator out of the live region; give the message's status region the status text only.

## Examples

- Status text the transport supplied — `examples/html/specific-status.html` (mode:specific-status, rule:LQ-THINK-01)
- Elapsed time after five seconds — `examples/html/elapsed.html` (state:enabled, rule:LQ-WAIT-01, rule:LQ-THINK-04)
- ✗ Three dots and nothing else — `examples/anti/anonymous-dots.html` violates LQ-THINK-03, LQ-WAIT-01
- ✗ A role="status" region that counts the seconds aloud — `examples/anti/elapsed-in-live-region.html` violates LQ-THINK-04, LQ-A11Y-01

## Implementations

- html: `examples/html/thinking-indicator.html` (reference)

## Exemplars

- Apple HIG — "Finding substitutions for ingredients" instead of "Processing…".
- Claude — the shimmer runs over the word, not over a bar; the word changes as the work changes.
- Jim Nielsen (2026) — shimmer text "shows staying power as genuinely useful UX".

## Sources

- https://developer.apple.com/design/human-interface-guidelines/generative-ai
- https://github.com/vercel/ai-elements/releases
- https://blog.jim-nielsen.com/
