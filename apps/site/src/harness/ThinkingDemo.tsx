import {
  describe,
  isPending,
  ThinkingIndicator,
  type Event,
} from "@lacquer/react";
import { useEffect, useState } from "react";

import type { DemoProps } from "../demos.ts";
import { EventControls } from "./EventControls.tsx";
import { Timeline } from "./Timeline.tsx";
import { useThread } from "./useThread.ts";

/**
 * The indicator alone in an assistant slot. It exists while the status is
 * submitted and at no other time; the transport delay is long enough here
 * to watch the elapsed time appear at five seconds.
 */
export function ThinkingDemo({ onStatus, onVisit }: DemoProps) {
  const thread = useThread(7000);
  const { status, accepts, send } = thread;
  const [label, setLabel] = useState("");
  const shown = status === "submitted";

  useEffect(() => onStatus?.(status), [onStatus, status]);
  useEffect(() => {
    if (!shown) onVisit?.("hidden");
    else {
      onVisit?.("enabled");
      onVisit?.(label ? "specific-status" : "thinking");
    }
  }, [onVisit, shown, label]);

  const d = describe(status);
  const primary: Event = isPending(status) ? "stop" : "send";

  return (
    <div className="harness">
      <div className="thread" aria-label="Thread">
        <div className="assistant-slot">
          <ThinkingIndicator status={status} label={label || undefined} />
          {!shown && (
            <p className="meta">
              hidden · <code>{status}</code> · {d.user_sees}
            </p>
          )}
        </div>
      </div>

      <EventControls thread={thread} maxDelay={12000}>
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
          Specific status
          <input
            type="text"
            value={label}
            placeholder="Searching the web for ‘oklch contrast’"
            size={34}
            onChange={(e) => setLabel(e.currentTarget.value)}
          />
        </label>
      </EventControls>

      <Timeline thread={thread} />
    </div>
  );
}
