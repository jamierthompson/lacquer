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
