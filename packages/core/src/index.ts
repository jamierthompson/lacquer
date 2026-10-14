/**
 * @lacquer/core — the Lacquer catalog, compiled.
 *
 * Node consumers read dist/ through the loaders below. Browser consumers
 * import the JSON directly (`@lacquer/core/catalog.json`).
 */
import { readFile } from "node:fs/promises";
import path from "node:path";

import type {
  Catalog,
  CatalogComponent,
  IndexEntry,
  RuleCatalog,
} from "./types.ts";

export type * from "./types.ts";

/** The package directory. Every path in the catalog is relative to it. */
export const CORE_DIR = path.resolve(import.meta.dirname, "..");

/** Absolute path of a catalog-relative path (an entry's `path`, `skill` or example `file`). */
export const resolvePath = (relative: string): string =>
  path.join(CORE_DIR, relative);

const json = async <T>(relative: string): Promise<T> =>
  JSON.parse(await readFile(resolvePath(relative), "utf8")) as T;

export const loadIndex = (): Promise<IndexEntry[]> => json("dist/index.json");
export const loadCatalog = (): Promise<Catalog> => json("dist/catalog.json");
export const loadRules = (): Promise<RuleCatalog> => json("dist/rules.json");
export const loadComponent = (id: string): Promise<CatalogComponent> =>
  json(`dist/components/${id}.json`);
