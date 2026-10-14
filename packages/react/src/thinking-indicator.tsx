/**
 * Thinking indicator — the react implementation.
 * Spec: @lacquer/core, spec/catalog/ai/conversation/thinking-indicator/thinking-indicator.yaml
 *
 * Rendered while the thread status is `submitted` and in no other status
 * (LQ-THINK-02); it never reads message content (LQ-MACHINE-01). It is
 * text with a shimmer, not a live region: the message's status region
 * announces. The elapsed part appears after `elapsedAfter` and sits
 * outside every live region (LQ-THINK-04).
 */
import "@lacquer/core/catalog/ai/conversation/thinking-indicator/examples/html/thinking-indicator.css";
import { useEffect, useState } from "react";

import type { Status } from "./message-state-machine.ts";

export const THINKING_STRINGS = { thinking: "Thinking" };

export interface ThinkingIndicatorProps {
  /** The thread status. The indicator exists only while it is `submitted`. */
  status: Status;
  /** What the transport says it is doing, when it says anything (LQ-THINK-01). */
  label?: string;
  /** Milliseconds before elapsed time is shown. LQ-WAIT-01 requires it by 10 s. */
  elapsedAfter?: number;
  /** The pulsing dot before the text. */
  dot?: boolean;
  strings?: Partial<typeof THINKING_STRINGS>;
}

export function ThinkingIndicator({
  status,
  ...props
}: ThinkingIndicatorProps) {
  // Mounting and unmounting on the status is what resets the clock.
  return status === "submitted" ? <Shown {...props} /> : null;
}

function Shown({
  label,
  elapsedAfter = 5000,
  dot = true,
  strings,
}: Omit<ThinkingIndicatorProps, "status">) {
  const [elapsed, setElapsed] = useState<number | null>(null);

  useEffect(() => {
    const start = Date.now();
    const tick = () => {
      const ms = Date.now() - start;
      setElapsed(ms >= elapsedAfter ? Math.floor(ms / 1000) : null);
    };
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [elapsedAfter]);

  return (
    <div
      data-lacquer="thinking-indicator"
      data-mode={label ? "specific-status" : "thinking"}
      data-elapsed={elapsed !== null || undefined}
    >
      {dot && <span data-slot="dot" aria-hidden="true" />}
      <span data-slot="status-text">
        {label ?? strings?.thinking ?? THINKING_STRINGS.thinking}
      </span>
      {elapsed !== null && <span data-slot="elapsed">{elapsed}s</span>}
    </div>
  );
}
