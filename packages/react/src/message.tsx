/**
 * Message — the react implementation.
 * Spec: @lacquer/core, spec/catalog/ai/conversation/message/message.yaml
 *
 * The container for one turn. It writes the thread status it is given to
 * data-state unchanged and derives its one announcement from that status
 * (LQ-MESSAGE-01); it never reads its children. The status part is the
 * turn's only polite live region, throttled to one change per 2 s
 * (LQ-MESSAGE-02, LQ-A11Y-01). Cancelled appends the note and removes
 * nothing (LQ-MESSAGE-03). The parts are children; the stylesheet is the
 * HTML reference's.
 */
import "@lacquer/core/catalog/ai/conversation/message/examples/html/message.css";
import { useEffect, useRef, useState, type ReactNode } from "react";

import type { Status } from "./message-state-machine.ts";

export const MESSAGE_STRINGS = {
  you: "You said",
  assistant: "Assistant said",
  thinking: "Thinking",
  reasoning: "Reasoning",
  running: "Running {activity}",
  tool: "a tool",
  complete: "Response complete",
  stopped: "Stopped",
};

export interface MessageProps {
  from?: "user" | "assistant";
  /** The thread status from message-state-machine. Required on an assistant message; ignored on a user message. */
  status?: Status;
  /** What the transport says it is doing, humanised; used only in the announcement. */
  activity?: string;
  /** The accessible name. Defaults by `from`. */
  label?: string;
  identity?: ReactNode;
  actions?: ReactNode;
  strings?: Partial<typeof MESSAGE_STRINGS>;
  /** The parts, in order. */
  children?: ReactNode;
}

/**
 * The status region's text for a status: a lookup in the spec's
 * announcements, never a reading of the content (LQ-MESSAGE-01). Empty where
 * another component announces (streamed text, the approval prompt, the error).
 */
export function announcement(
  status: Status,
  activity?: string,
  strings: typeof MESSAGE_STRINGS = MESSAGE_STRINGS,
): string {
  switch (status) {
    case "submitted":
      return activity ?? strings.thinking;
    case "streaming:reasoning":
      return strings.reasoning;
    case "streaming:tool":
      return strings.running.replace("{activity}", activity ?? strings.tool);
    case "complete":
      return strings.complete;
    case "cancelled":
      return strings.stopped;
    default:
      return "";
  }
}

/**
 * At most one change per `interval` reaches the live region (LQ-A11Y-01).
 * Starts empty so the first text is a change to an existing region, which is
 * what assistive tech reliably announces.
 */
function useThrottled(value: string, interval: number): string {
  const [shown, setShown] = useState("");
  const last = useRef(0);
  useEffect(() => {
    if (value === shown) return;
    const commit = () => {
      last.current = Date.now();
      setShown(value);
    };
    const wait = last.current + interval - Date.now();
    if (wait <= 0) {
      commit();
      return;
    }
    const t = setTimeout(commit, wait);
    return () => clearTimeout(t);
  }, [value, shown, interval]);
  return shown;
}

export function Message({
  from = "assistant",
  status,
  activity,
  label,
  identity,
  actions,
  strings,
  children,
}: MessageProps) {
  const s = { ...MESSAGE_STRINGS, ...strings };
  const assistant = from === "assistant";
  const live = useThrottled(
    assistant && status ? announcement(status, activity, s) : "",
    2000,
  );

  return (
    <article
      data-lacquer="message"
      data-from={from}
      data-state={assistant ? status : undefined}
      aria-label={label ?? (assistant ? s.assistant : s.you)}
    >
      {identity != null && <div data-slot="identity">{identity}</div>}
      {assistant && (
        <p data-slot="status" role="status">
          {live}
        </p>
      )}
      <div data-slot="content">{children}</div>
      {assistant && status === "cancelled" && (
        <p data-slot="note">{s.stopped}</p>
      )}
      {actions != null && <div data-slot="actions">{actions}</div>}
    </article>
  );
}
