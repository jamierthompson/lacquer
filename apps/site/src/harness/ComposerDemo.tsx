import { Composer, describe, ThinkingIndicator } from "@lacquer/react";
import { useEffect, useState } from "react";

import type { DemoProps } from "../demos.ts";
import { EventControls } from "./EventControls.tsx";
import { Timeline } from "./Timeline.tsx";
import { useThread } from "./useThread.ts";

/**
 * The composer wired to a thread. Its Send becomes Stop because the status
 * left idle; the thinking indicator above it appears because the status is
 * submitted. Neither reads the draft or any message text to decide.
 */
export function ComposerDemo({ onStatus, onVisit }: DemoProps) {
  const thread = useThread();
  const { status, send } = thread;
  const [disabled, setDisabled] = useState(false);
  const [attachments, setAttachments] = useState(false);
  const [submitKey, setSubmitKey] = useState<"enter" | "mod-enter">("enter");
  const [sent, setSent] = useState<string>();

  useEffect(() => onStatus?.(status), [onStatus, status]);
  useEffect(
    () => onVisit?.(disabled ? "disabled" : "enabled"),
    [onVisit, disabled],
  );
  useEffect(() => {
    if (attachments) onVisit?.("attachments-pending");
  }, [onVisit, attachments]);

  const d = describe(status);

  return (
    <div className="harness">
      <div className="thread" aria-label="Thread">
        {sent !== undefined && <p className="user-message">{sent}</p>}
        <div className="assistant-slot">
          <ThinkingIndicator status={status} />
          {status !== "submitted" && (
            <p className="meta">
              <code>{status}</code> · {d.user_sees}
            </p>
          )}
        </div>
      </div>

      <Composer
        status={status}
        disabled={disabled}
        submitKey={submitKey}
        onChange={(v) => onVisit?.(v.trim() ? "filled" : "empty")}
        onSubmit={(v) => {
          setSent(v);
          send("send");
        }}
        onStop={() => send("stop")}
        attachments={
          attachments ? (
            <span className="attachment" role="status">
              report.pdf
            </span>
          ) : undefined
        }
        disclaimer="AI can make mistakes. Check important information."
      />

      <EventControls thread={thread}>
        <label className="toggle">
          <input
            type="checkbox"
            checked={disabled}
            onChange={(e) => setDisabled(e.currentTarget.checked)}
          />
          Disabled
        </label>
        <label className="toggle">
          <input
            type="checkbox"
            checked={attachments}
            onChange={(e) => setAttachments(e.currentTarget.checked)}
          />
          Attachment
        </label>
        <label className="toggle">
          Submit on
          <select
            value={submitKey}
            onChange={(e) =>
              setSubmitKey(e.currentTarget.value as "enter" | "mod-enter")
            }
          >
            <option value="enter">Enter</option>
            <option value="mod-enter">⌘/Ctrl+Enter</option>
          </select>
        </label>
      </EventControls>

      <Timeline thread={thread} />
    </div>
  );
}
