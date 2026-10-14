import {
  describe,
  eventsFrom,
  initial,
  isPending,
  replay,
  transition,
  type Event,
  type Status,
} from "@lacquer/react";
import { useEffect, useReducer } from "react";

import type { DemoProps } from "../demos.ts";

/**
 * What a scripted transport emits after `send`, on a timer. It stops at
 * `awaiting-approval`: only the user's decision leaves that state, because
 * a transport that answers its own approval prompt is what LQ-GATE-01
 * forbids. After the decision the script picks up where it left off.
 */
const SCRIPT: readonly Event[] = [
  "reasoning-delta",
  "tool-input-start",
  "approval-requested",
  "approval-responded",
  "text-delta",
  "finish",
];

/** Events that start (or restart) the script. */
const STARTS: readonly Event[] = ["send", "retry", "regenerate"];

/** How far through the script the log is, counted from the last start. */
function scriptStep(events: readonly Event[]): number {
  const start = events.findLastIndex((e) => STARTS.includes(e));
  if (start < 0) return -1;
  let step = 0;
  for (let i = start + 1; i < events.length && step < SCRIPT.length; i++)
    if (events[i] === SCRIPT[step]) step++;
  return step;
}

/**
 * The harness holds a log of events and, while scrubbing, a cursor into it.
 * The status is never stored: it is the log replayed through the reducer
 * (LQ-MACHINE-05), so scrubbing the timeline is the same computation as
 * living through it.
 */
interface State {
  events: Event[];
  /** `null` is live; a number shows the status after that many events. */
  cursor: number | null;
}
type Action =
  { type: "dispatch"; event: Event } | { type: "scrub"; cursor: number | null };

function reduce(state: State, action: Action): State {
  switch (action.type) {
    case "dispatch": {
      // Dispatching while scrubbed forks the log from the cursor.
      const kept =
        state.cursor === null
          ? state.events
          : state.events.slice(0, state.cursor);
      return { events: [...kept, action.event], cursor: null };
    }
    case "scrub":
      return { ...state, cursor: action.cursor };
  }
}

const CONTROLS: { event: Event; label: string }[] = [
  { event: "approval-responded", label: "Allow" },
  { event: "error", label: "Error" },
  { event: "retry", label: "Retry" },
  { event: "regenerate", label: "Regenerate" },
];

export function MachineHarness({ onStatus }: DemoProps) {
  const [state, dispatch] = useReducer(reduce, { events: [], cursor: null });
  const [delay, setDelay] = useReducer((_: number, n: number) => n, 900);
  const live = state.cursor === null;
  const shown =
    state.cursor === null ? state.events : state.events.slice(0, state.cursor);
  const status: Status = replay(shown);
  const accepts = eventsFrom(status);
  const send = (event: Event) => dispatch({ type: "dispatch", event });

  useEffect(() => onStatus?.(status), [onStatus, status]);

  // The transport: the next scripted event, after the delay, while the turn
  // is pending and not waiting on the user.
  useEffect(() => {
    if (!live || !isPending(status) || status === "awaiting-approval") return;
    const next = SCRIPT[scriptStep(state.events)];
    if (!next) return;
    const t = setTimeout(() => send(next), delay);
    return () => clearTimeout(t);
  }, [live, status, state.events, delay]);

  const d = describe(status);
  const primary: Event = isPending(status) ? "stop" : "send";

  return (
    <div className="harness">
      <div className="readout" data-status={status}>
        <p className="meta">status</p>
        <p className="readout-status">
          <code>{status}</code>
          {d.terminal && <small className="meta"> terminal</small>}
          {!live && <small className="meta"> scrubbed</small>}
        </p>
        <dl className="readout-table">
          <dt>User sees</dt>
          <dd>{d.user_sees}</dd>
          <dt>Composer</dt>
          <dd>{d.composer_control}</dd>
          <dt>Announcement</dt>
          <dd>{d.announcement}</dd>
        </dl>
      </div>

      <div className="controls" role="group" aria-label="Events">
        <button
          type="button"
          data-event={primary}
          data-primary
          disabled={!accepts.includes(primary)}
          onClick={() => send(primary)}
        >
          {primary === "stop" ? "Stop" : "Send"}
        </button>
        {CONTROLS.map((c) => (
          <button
            key={c.event}
            type="button"
            data-event={c.event}
            disabled={!accepts.includes(c.event)}
            onClick={() => send(c.event)}
          >
            {c.label}
          </button>
        ))}
        <label className="delay">
          Transport delay
          <input
            type="range"
            min={200}
            max={2000}
            step={100}
            value={delay}
            onChange={(e) => setDelay(Number(e.currentTarget.value))}
          />
          <span className="meta">{delay} ms</span>
        </label>
      </div>

      <ol className="timeline" aria-label="Timeline">
        <li>
          <button
            type="button"
            aria-current={shown.length === 0 ? "step" : undefined}
            onClick={() =>
              dispatch({
                type: "scrub",
                cursor: state.events.length ? 0 : null,
              })
            }
          >
            <code>{initial}</code>
          </button>
        </li>
        {state.events.map((e, i) => {
          const before = replay(state.events.slice(0, i));
          const after = transition(before, e);
          const ignored = before === after;
          const at = i + 1;
          return (
            <li key={at} data-ignored={ignored || undefined}>
              <button
                type="button"
                aria-current={shown.length === at ? "step" : undefined}
                onClick={() =>
                  dispatch({
                    type: "scrub",
                    cursor: at === state.events.length ? null : at,
                  })
                }
              >
                <span className="event">{e}</span>
                <code>{ignored ? "ignored" : after}</code>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
