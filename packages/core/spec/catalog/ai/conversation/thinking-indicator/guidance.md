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
