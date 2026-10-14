import { describe, isPending, type Event } from "@lacquer/react";
import { useEffect } from "react";

import type { DemoProps } from "../demos.ts";
import { EventControls } from "./EventControls.tsx";
import { Timeline } from "./Timeline.tsx";
import { useThread } from "./useThread.ts";

/**
 * The state machine on its own: a readout of the status and what the spec
 * says each component shows in it, the events as buttons, and the timeline.
 */
export function MachineHarness({ onStatus }: DemoProps) {
  const thread = useThread();
  const { status, accepts, send, live } = thread;

  useEffect(() => onStatus?.(status), [onStatus, status]);

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

      <EventControls thread={thread}>
        <button
          type="button"
          data-event={primary}
          data-primary
          disabled={!accepts.includes(primary)}
          onClick={() => send(primary)}
        >
          {primary === "stop" ? "Stop" : "Send"}
        </button>
      </EventControls>

      <Timeline thread={thread} />
    </div>
  );
}
