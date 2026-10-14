import type { CatalogComponent } from "@lacquer/core";
import type { ComponentType } from "react";

import { MachineHarness } from "./harness/MachineHarness.tsx";

/**
 * What an entry page renders on its stage. Each demo drives the entry's React
 * implementation through every state the spec names and reports the current
 * status, so the contract panel beside it can tick states off as they are
 * reached.
 */
export interface DemoProps {
  onStatus?: (status: string) => void;
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
