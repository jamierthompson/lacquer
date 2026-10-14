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
