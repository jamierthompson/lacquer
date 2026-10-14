import { Composer } from "@lacquer/react";
import { useEffect, useState } from "react";

import type { DemoProps } from "../demos.ts";
import { EventControls } from "./EventControls.tsx";
import { Timeline } from "./Timeline.tsx";
import { Turn } from "./Turn.tsx";
import { useThread } from "./useThread.ts";
import { useTurn } from "./useTurn.ts";

/**
 * A whole turn from the composer up: the user bubble, then the assistant
 * message carrying the status through every state, with the indicator, the
 * tool card and the approval prompt inside it, and the composer beneath.
 * Everything on the stage renders from the one status.
 */
export function MessageDemo({ onStatus, onVisit }: DemoProps) {
  const thread = useThread();
  const turn = useTurn(thread);
  const { status, send } = thread;
  const [prompt, setPrompt] = useState("Run the tests and tell me what fails.");

  useEffect(() => onStatus?.(status), [onStatus, status]);
  useEffect(() => onVisit?.("user"), [onVisit]);
  useEffect(() => {
    if (status !== "idle") onVisit?.("assistant");
  }, [onVisit, status]);

  return (
    <div className="harness">
      <Turn thread={thread} turn={turn} prompt={prompt} effect="write" always />

      <Composer
        status={status}
        onSubmit={(v) => {
          setPrompt(v);
          send("send");
        }}
        onStop={() => send("stop")}
        disclaimer="AI can make mistakes. Check important information."
      />

      <EventControls thread={thread} except={["approval-responded"]} />

      <Timeline thread={thread} />
    </div>
  );
}
