import { isPending, type Event } from "@lacquer/react";
import { useEffect, useState } from "react";

import type { DemoProps } from "../demos.ts";
import { EventControls } from "./EventControls.tsx";
import { Timeline } from "./Timeline.tsx";
import { Turn } from "./Turn.tsx";
import { useThread } from "./useThread.ts";
import { type Effect, useTurn } from "./useTurn.ts";

/**
 * The approval prompt inside its tool card. The transport stops at
 * awaiting-approval and only the prompt moves it on: Allow once, Always
 * allow (where the call can state a scope), Deny with or without a
 * correction, or the product's time-out, which is a deny. The effect axis
 * moves the default focus between Allow once and Deny.
 */
export function ApprovalDemo({ onStatus, onVisit }: DemoProps) {
  const thread = useThread();
  const turn = useTurn(thread);
  const { status, accepts, send } = thread;
  const { tool, recorded, decide } = turn;
  const [effect, setEffect] = useState<Effect>("destroy");
  const [always, setAlways] = useState(true);
  const primary: Event = isPending(status) ? "stop" : "send";
  const promptState =
    tool === "approval-requested"
      ? "approval-requested"
      : tool === "approval-responded" || tool === "output-denied"
        ? "approval-responded"
        : undefined;

  useEffect(() => {
    if (promptState) onStatus?.(promptState);
  }, [onStatus, promptState]);
  useEffect(() => onVisit?.("enabled"), [onVisit]);
  useEffect(() => {
    if (!recorded) return;
    onVisit?.(
      recorded.decision === "deny" && recorded.correction
        ? "deny-with-correction"
        : recorded.decision,
    );
  }, [onVisit, recorded]);

  return (
    <div className="harness">
      <Turn
        thread={thread}
        turn={turn}
        prompt="Clean the build output, then rebuild."
        effect={effect}
        always={always}
      />

      <EventControls thread={thread} except={["approval-responded"]}>
        <button
          type="button"
          data-event={primary}
          data-primary
          disabled={!accepts.includes(primary)}
          onClick={() => send(primary)}
        >
          {primary === "stop" ? "Stop" : "Send"}
        </button>
        <button
          type="button"
          disabled={status !== "awaiting-approval"}
          onClick={() => decide("timed-out")}
        >
          Time out
        </button>
        <label className="toggle">
          Effect
          <select
            value={effect}
            onChange={(e) => setEffect(e.currentTarget.value as Effect)}
          >
            <option value="read">read</option>
            <option value="write">write</option>
            <option value="destroy">destroy</option>
          </select>
        </label>
        <label className="toggle">
          <input
            type="checkbox"
            checked={always}
            onChange={(e) => setAlways(e.currentTarget.checked)}
          />
          Offer Always allow
        </label>
      </EventControls>

      <Timeline thread={thread} />
    </div>
  );
}
