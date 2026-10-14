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
