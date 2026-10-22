/**
 * @lacquer/core — the Lacquer catalog, compiled.
 *
 * Node consumers read dist/ through the loaders below. Browser consumers
 * import the JSON directly (`@lacquer/core/catalog.json`).
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type {
  Bindings,
  Catalog,
  CatalogComponent,
  IndexEntry,
  Rubric,
  RuleCatalog,
  Vocab,
} from "./types.ts";

export type * from "./types.ts";

/**
 * The package directory. Every path in the catalog is relative to it.
 * Resolved from `import.meta.url`, which a bundler keeps pointing at the
 * source file; `import.meta.dirname` does not survive one, and a relative
 * `new URL()` is taken for an asset reference.
 */
export const CORE_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

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
export const loadBindings = (): Promise<Bindings> => json("dist/bindings.json");
export const loadVocab = (): Promise<Vocab> => json("dist/vocab.json");
export const loadRubric = (): Promise<Rubric> => json("dist/rubric.json");
/** The finish report's JSON Schema, for validating a report. */
export const REPORT_SCHEMA = resolvePath("grading/report.schema.json");
