import type { Decision, Event, ToolState } from "@lacquer/react";
import { useEffect, useState } from "react";

import { STARTS, turnStart, type Thread } from "./useThread.ts";

/**
 * The one tool call the scripted transport makes, humanised the way a
 * product would: progressive while running, past tense when done, and a
 * title with verb, object and scope for the approval prompt (LQ-GATE-02).
 */
export type Effect = "read" | "write" | "destroy";
export interface Call {
  running: string;
  done: string;
  title: string;
  payload: string;
  input: unknown;
  output: unknown;
  error: string;
  risk: { touches: string; reversible: string; reach: string };
  /** The rule an Always option would save, when one can be stated. */
  scope?: string;
  /** The text the model writes after the tool. */
  text: string;
}
export const CALLS: Record<Effect, Call> = {
  read: {
    running: "Reading src/app.tsx",
    done: "Read src/app.tsx",
    title: "Read src/app.tsx outside the sandbox",
    payload: "cat src/app.tsx",
    input: { path: "src/app.tsx" },
    output: { lines: 120 },
    error: "Couldn't read src/app.tsx: permission denied",
    risk: {
      touches: "src/app.tsx",
      reversible: "Yes. Nothing is written.",
      reach: "Outside the sandbox",
    },
    scope: "reads in src/",
    text: "src/app.tsx mounts the router and nothing else; the button lives in src/button.tsx.",
  },
  write: {
    running: "Running npm test",
    done: "Ran npm test",
    title: "Run npm test in this repo",
    payload: "npm test",
    input: { command: "npm test" },
    output: { passed: 41, failed: 2 },
    error: "Couldn't run npm test: node_modules is missing",
    risk: {
      touches: "node_modules/.cache, the test runner's temp files",
      reversible: "Yes",
      reach: "Inside this repo",
    },
    scope: "npm test in this repo",
    text: "Two tests fail, both in button.test.tsx: the loading state no longer reserves its width.",
  },
  destroy: {
    running: "Deleting dist/ (14 files)",
    done: "Deleted dist/ (14 files)",
    title: "Delete dist/ (14 files) in this repo",
    payload: "rm -rf dist/",
    input: { path: "dist/", recursive: true },
    output: { removed: 14 },
    error: "Couldn't delete dist/: permission denied",
    risk: {
      touches: "dist/, 14 files",
      reversible: "No. dist/ is build output and is not in git.",
      reach: "Inside this repo",
    },
    text: "dist/ is gone; the next build will recreate it.",
  },
};

export interface Recorded {
  decision: Decision;
  correction?: string;
}

/**
 * The tool part's state, derived from the turn's events and the recorded
 * decision. One state per tool part beside the thread's one status
 * (message-state-machine); like the status, it is replayed from the log,
 * never stored. Stop while a prompt is open leaves the part denied.
 */
export function toolState(
  events: readonly Event[],
  recorded: Recorded | null,
): ToolState | null {
  let state: ToolState | null = null;
  const allowed =
    recorded?.decision === "allow-once" ||
    recorded?.decision === "allow-always";
  for (const e of events.slice(turnStart(events))) {
    switch (e) {
      case "tool-input-start":
        state = "input-available";
        break;
      case "approval-requested":
        state = "approval-requested";
        break;
      case "approval-responded":
        state = "approval-responded";
        break;
      case "text-delta":
      case "finish":
        if (state)
          state = recorded && !allowed ? "output-denied" : "output-available";
        break;
      case "error":
        if (state) state = "output-error";
        break;
      case "stop":
        // Stop while the prompt is open ends the turn without the action:
        // the tool part is denied, with no decision recorded.
        if (state === "approval-requested") state = "output-denied";
        break;
    }
  }
  return state;
}

export interface Turn {
  /** The tool part's state, or null before the transport calls a tool. */
  tool: ToolState | null;
  /** The user's decision this turn, once made. */
  recorded: Recorded | null;
  /** Record a decision and tell the thread. A time-out is the product's call. */
  decide: (decision: Decision, correction?: string) => void;
  /** The turn has streamed text. */
  text: boolean;
}

/**
 * One assistant turn on top of a thread: the tool part's state and the
 * decision the user made. The decision is the only thing held beside the
 * log, because the machine's `approval-responded` event does not carry it.
 */
export function useTurn(thread: Thread): Turn {
  const { shown, events, send, delay, live } = thread;
  const [recorded, setRecorded] = useState<Recorded | null>(null);
  const [start, setStart] = useState(turnStart(events));
  // A new turn forgets the last decision.
  const now = turnStart(events);
  if (now !== start) {
    setStart(now);
    setRecorded(null);
  }

  // The transport streams the arguments before it runs the tool: the card
  // is input-streaming for half a transport step after tool-input-start.
  const [streaming, setStreaming] = useState(false);
  const justStarted = live && shown.at(-1) === "tool-input-start";
  useEffect(() => {
    if (!justStarted) return;
    setStreaming(true);
    const t = setTimeout(() => setStreaming(false), delay / 2);
    return () => {
      clearTimeout(t);
      setStreaming(false);
    };
  }, [justStarted, delay, shown.length]);

  const base = toolState(shown, recorded);
  const tool =
    streaming && base === "input-available" ? "input-streaming" : base;
  const turn = shown.slice(turnStart(shown));

  return {
    tool,
    recorded,
    decide: (decision, correction) => {
      setRecorded({ decision, correction });
      send("approval-responded");
    },
    text: turn.includes("text-delta"),
  };
}

export { STARTS };
