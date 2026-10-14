import type { CatalogComponent } from "@lacquer/core";
import type { ComponentType } from "react";

import { ApprovalDemo } from "./harness/ApprovalDemo.tsx";
import { ComposerDemo } from "./harness/ComposerDemo.tsx";
import { MachineHarness } from "./harness/MachineHarness.tsx";
import { MessageDemo } from "./harness/MessageDemo.tsx";
import { ThinkingDemo } from "./harness/ThinkingDemo.tsx";
import { ToolCallDemo } from "./harness/ToolCallDemo.tsx";

/**
 * What an entry page renders on its stage. Each demo drives the entry's React
 * implementation through every state the spec names and reports what it is
 * showing, so the contract panel beside it can tick states and modes off as
 * they are reached.
 */
export interface DemoProps {
  /** The thread status the stage is in now. */
  onStatus?: (status: string) => void;
  /** A state or mode id the stage is showing, beside the status. */
  onVisit?: (id: string) => void;
}

export interface Demo {
  component: ComponentType<DemoProps>;
  /** The entry's compiled contract, loaded only when its page opens. */
  spec: () => Promise<{ default: unknown }>;
}

export const demos: Record<string, Demo> = {
  "message-state-machine": {
    component: MachineHarness,
    spec: () => import("@lacquer/core/components/message-state-machine.json"),
  },
  composer: {
    component: ComposerDemo,
    spec: () => import("@lacquer/core/components/composer.json"),
  },
  "thinking-indicator": {
    component: ThinkingDemo,
    spec: () => import("@lacquer/core/components/thinking-indicator.json"),
  },
  message: {
    component: MessageDemo,
    spec: () => import("@lacquer/core/components/message.json"),
  },
  "tool-call-card": {
    component: ToolCallDemo,
    spec: () => import("@lacquer/core/components/tool-call-card.json"),
  },
  "approval-prompt": {
    component: ApprovalDemo,
    spec: () => import("@lacquer/core/components/approval-prompt.json"),
  },
};

const loading = new Map<string, Promise<CatalogComponent>>();

/** One promise per entry, so React's `use` sees a stable value across renders. */
export function loadSpec(id: string, demo: Demo): Promise<CatalogComponent> {
  let p = loading.get(id);
  if (!p) {
    p = demo.spec().then((m) => m.default as CatalogComponent);
    loading.set(id, p);
  }
  return p;
}
