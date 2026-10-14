import type { IndexEntry } from "@lacquer/core";
import index from "@lacquer/core/index.json";

/** dist/index.json: the light listing, one row per entry. */
export const entries = index as IndexEntry[];

export const entry = (id: string | undefined): IndexEntry | undefined =>
  entries.find((c) => c.id === id);
