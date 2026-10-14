import {
  eventsFrom,
  initial,
  isPending,
  replay,
  transition,
  type Event,
  type Status,
} from "@lacquer/react";
import { useEffect, useReducer } from "react";

/**
 * What a scripted transport emits after `send`, on a timer. It stops at
 * `awaiting-approval`: only the user's decision leaves that state, because
 * a transport that answers its own approval prompt is what LQ-GATE-01
 * forbids. After the decision the script picks up where it left off.
 */
export const SCRIPT: readonly Event[] = [
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

export interface Thread {
  /** The status the stage shows: the shown log replayed through the reducer. */
  status: Status;
  /** The whole log. */
  events: readonly Event[];
  /** The log up to the cursor (the whole log while live). */
  shown: readonly Event[];
  live: boolean;
  /** Events the table accepts from the current status. */
  accepts: readonly Event[];
  send: (event: Event) => void;
  scrub: (cursor: number | null) => void;
  /** Milliseconds between scripted transport events. */
  delay: number;
  setDelay: (ms: number) => void;
}

/**
 * One thread driven by the scripted transport: a status, the event log it
 * is replayed from, and the controls every demo shares.
 */
export function useThread(initialDelay = 900): Thread {
  const [state, dispatch] = useReducer(reduce, { events: [], cursor: null });
  const [delay, setDelay] = useReducer(
    (_: number, n: number) => n,
    initialDelay,
  );
  const live = state.cursor === null;
  const shown =
    state.cursor === null ? state.events : state.events.slice(0, state.cursor);
  const status = replay(shown);
  const send = (event: Event) => dispatch({ type: "dispatch", event });

  // The transport: the next scripted event, after the delay, while the turn
  // is pending and not waiting on the user.
  useEffect(() => {
    if (!live || !isPending(status) || status === "awaiting-approval") return;
    const next = SCRIPT[scriptStep(state.events)];
    if (!next) return;
    const t = setTimeout(() => send(next), delay);
    return () => clearTimeout(t);
  }, [live, status, state.events, delay]);

  return {
    status,
    events: state.events,
    shown,
    live,
    accepts: eventsFrom(status),
    send,
    scrub: (cursor) => dispatch({ type: "scrub", cursor }),
    delay,
    setDelay,
  };
}

/** The status before and after one event in the log, for the timeline. */
export function step(events: readonly Event[], i: number) {
  const before = replay(events.slice(0, i));
  const after = transition(before, events[i]!);
  return { before, after, ignored: before === after };
}

export { initial };
