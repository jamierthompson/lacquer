import type { Event } from "@lacquer/react";
import type { ReactNode } from "react";

import type { Thread } from "./useThread.ts";

const CONTROLS: { event: Event; label: string }[] = [
  { event: "approval-responded", label: "Allow" },
  { event: "error", label: "Error" },
  { event: "retry", label: "Retry" },
  { event: "regenerate", label: "Regenerate" },
];

/**
 * The events a demo lets you fire by hand, each enabled only where the
 * table has a row, plus the transport delay. `children` go first: the
 * demo's own controls.
 */
export function EventControls({
  thread,
  maxDelay = 2000,
  children,
}: {
  thread: Thread;
  maxDelay?: number;
  children?: ReactNode;
}) {
  const { accepts, send, delay, setDelay } = thread;
  return (
    <div className="controls" role="group" aria-label="Events">
      {children}
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
          max={maxDelay}
          step={100}
          value={delay}
          onChange={(e) => setDelay(Number(e.currentTarget.value))}
        />
        <span className="meta">{delay} ms</span>
      </label>
    </div>
  );
}
