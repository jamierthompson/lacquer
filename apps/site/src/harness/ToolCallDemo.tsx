import { isPending, type Event } from "@lacquer/react";
import { useEffect, useState } from "react";

import type { DemoProps } from "../demos.ts";
import { EventControls } from "./EventControls.tsx";
import { Timeline } from "./Timeline.tsx";
import { Turn } from "./Turn.tsx";
import { useThread } from "./useThread.ts";
import { type Effect, useTurn } from "./useTurn.ts";

/**
 * The tool card driven by the thread. Its state is the tool part's, replayed
 * from the same log as the status: arguments stream, the tool runs, asks,
 * is answered inside the card, completes, errors or is denied. The effect
 * axis changes what the call is; the density axis changes the frame.
 */
export function ToolCallDemo({ onStatus, onVisit }: DemoProps) {
  const thread = useThread();
  const turn = useTurn(thread);
  const { status, accepts, send } = thread;
  const [effect, setEffect] = useState<Effect>("write");
  const [density, setDensity] = useState<"row" | "card">("row");
  const primary: Event = isPending(status) ? "stop" : "send";

  useEffect(() => {
    if (turn.tool) onStatus?.(turn.tool);
  }, [onStatus, turn.tool]);
  useEffect(() => onVisit?.("enabled"), [onVisit]);

  return (
    <div className="harness">
      <Turn
        thread={thread}
        turn={turn}
        prompt="Run the tests and tell me what fails."
        effect={effect}
        density={density}
        always
        onToolOpen={(open) => open && onVisit?.("expanded")}
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
          Density
          <select
            value={density}
            onChange={(e) =>
              setDensity(e.currentTarget.value as "row" | "card")
            }
          >
            <option value="row">row</option>
            <option value="card">card</option>
          </select>
        </label>
      </EventControls>

      <Timeline thread={thread} />
    </div>
  );
}
