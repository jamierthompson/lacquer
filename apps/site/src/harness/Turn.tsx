import {
  ApprovalPrompt,
  describe,
  isTerminal,
  Message,
  ThinkingIndicator,
  ToolCallCard,
} from "@lacquer/react";

import { CALLS, type Effect, type Turn as TurnState } from "./useTurn.ts";
import type { Thread } from "./useThread.ts";

/**
 * One turn rendered from one status: the user message, then the assistant
 * message with the indicator, the tool card and, inside it, the approval
 * prompt, each handed the status or the tool state and nothing else. The
 * parts a later step builds (reasoning, streamed text, actions, the error)
 * are placeholders that quote what the spec says the user sees there.
 */
export function Turn({
  thread,
  turn,
  prompt,
  effect,
  density = "row",
  always = false,
  onToolOpen,
}: {
  thread: Thread;
  turn: TurnState;
  prompt: string;
  effect: Effect;
  density?: "row" | "card";
  /** Offer the Always option where the call can state a scope. */
  always?: boolean;
  onToolOpen?: (open: boolean) => void;
}) {
  const { status, send, accepts, live } = thread;
  const { tool, recorded, decide, text } = turn;
  const call = CALLS[effect];
  const d = describe(status);
  const terminal = isTerminal(status);
  const done = tool === "output-available";
  const allowed =
    recorded?.decision === "allow-once" ||
    recorded?.decision === "allow-always";

  return (
    <div className="thread" aria-label="Thread">
      <Message from="user">
        <p>{prompt}</p>
      </Message>
      {status !== "idle" && (
        <Message
          from="assistant"
          status={status}
          activity={tool ? call.running : undefined}
          actions={
            terminal ? <span className="part">message-actions</span> : undefined
          }
        >
          <ThinkingIndicator status={status} />
          {status === "streaming:reasoning" && (
            <p className="part">reasoning-disclosure · {d.user_sees}</p>
          )}
          {tool && (
            <ToolCallCard
              state={tool}
              name={done ? call.done : call.running}
              effect={effect}
              density={density}
              input={call.input}
              output={done ? call.output : undefined}
              error={call.error}
              approved={recorded ? allowed : undefined}
              onOpenChange={onToolOpen}
              onRetry={
                accepts.includes("retry") ? () => send("retry") : undefined
              }
              approval={
                <ApprovalPrompt
                  state={
                    tool === "approval-requested"
                      ? "approval-requested"
                      : "approval-responded"
                  }
                  title={call.title}
                  payload={call.payload}
                  risk={call.risk}
                  effect={effect}
                  alwaysScope={always ? call.scope : undefined}
                  decision={
                    recorded?.decision ??
                    (tool === "output-denied" ? "deny" : undefined)
                  }
                  correction={recorded?.correction}
                  autoFocus={live}
                  onDecide={decide}
                />
              }
            />
          )}
          {text && <p>{call.text}</p>}
          {status === "streaming:text" && (
            <p className="part">streaming-markdown · {d.user_sees}</p>
          )}
          {status === "error" && (
            <p className="part">error-refusal-state · {d.user_sees}</p>
          )}
        </Message>
      )}
    </div>
  );
}
