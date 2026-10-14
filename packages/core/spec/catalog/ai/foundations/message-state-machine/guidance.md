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
