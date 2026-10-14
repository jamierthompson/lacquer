/**
 * Shared readers for the spec layer (spec/). The spec is the framework-agnostic
 * source of truth: one YAML per catalog entry under spec/catalog/<catalog>/<group>/<id>/,
 * validated against spec/schema/component.schema.json with enums injected from
 * spec/schema/vocab.yaml. Shared rules live in spec/rules/*.yaml. Everything in
 * dist/ and every SKILL.md next to a spec is generated from these files.
 */
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";

import type { Example, Rule, Spec, Vocab } from "../../src/types.ts";

export type { Example, Rule, Spec, Vocab };

export const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
export const SPEC_DIR = path.join(ROOT, "spec");
export const CATALOG_DIR = path.join(SPEC_DIR, "catalog");
export const SCHEMA_FILE = path.join(
  SPEC_DIR,
  "schema",
  "component.schema.json",
);
export const VOCAB_FILE = path.join(SPEC_DIR, "schema", "vocab.yaml");
export const SPEC_RULES_DIR = path.join(SPEC_DIR, "rules");
export const DIST_DIR = path.join(ROOT, "dist");

export interface SpecEntry {
  spec: Spec;
  /** Absolute folder of the entry. */
  dir: string;
  /** Path of the YAML relative to the repo root. */
  file: string;
  /** Hand-written prose merged into SKILL.md, if guidance.md exists. */
  guidance?: string;
}

export async function readVocab(file = VOCAB_FILE): Promise<Vocab> {
  return parseYaml(await readFile(file, "utf8")) as Vocab;
}

/** The schema with every `x-vocab` marker replaced by the vocab's enum. */
export async function readSchema(
  vocab: Vocab,
  file = SCHEMA_FILE,
): Promise<Record<string, unknown>> {
  const schema = JSON.parse(await readFile(file, "utf8"));
  const enums: Record<string, string[]> = {
    kinds: Object.keys(vocab.kinds),
    catalogs: Object.keys(vocab.catalogs),
    groups: [
      ...Object.keys(vocab.groups.core),
      ...Object.keys(vocab.groups.ai),
    ],
    atomic_levels: vocab.atomic_levels,
    maturity: vocab.maturity,
    status: Object.keys(vocab.status),
    states: Object.keys(vocab.states),
    renderers: Object.keys(vocab.renderers),
    rule_levels: Object.keys(vocab.rule_levels),
  };
  const walk = (node: unknown): void => {
    if (Array.isArray(node)) return node.forEach(walk);
    if (typeof node !== "object" || node === null) return;
    const obj = node as Record<string, unknown>;
    if (typeof obj["x-vocab"] === "string") {
      const key = obj["x-vocab"] as string;
      if (!enums[key])
        throw new Error(`schema references unknown vocab "${key}"`);
      obj.enum = enums[key];
      delete obj["x-vocab"];
    }
    Object.values(obj).forEach(walk);
  };
  walk(schema);
  return schema;
}

/** Shared rules: every spec/rules/*.yaml, in file order. */
export async function readSharedRules(): Promise<Rule[]> {
  const rules: Rule[] = [];
  for (const entry of (await readdir(SPEC_RULES_DIR)).sort()) {
    if (!entry.endsWith(".yaml")) continue;
    const doc = parseYaml(
      await readFile(path.join(SPEC_RULES_DIR, entry), "utf8"),
    ) as { rules: Omit<Rule, "owner">[] };
    for (const r of doc.rules)
      rules.push({ ...r, owner: "shared", file: `spec/rules/${entry}` });
  }
  return rules;
}

/** Every spec under spec/catalog, in path order. */
export async function readSpecs(root = CATALOG_DIR): Promise<SpecEntry[]> {
  const entries: SpecEntry[] = [];
  const walk = async (dir: string): Promise<void> => {
    for (const name of (await readdir(dir)).sort()) {
      const full = path.join(dir, name);
      if (!(await stat(full)).isDirectory()) continue;
      const specFile = path.join(full, `${name}.yaml`);
      let raw: string | null = null;
      try {
        raw = await readFile(specFile, "utf8");
      } catch {
        await walk(full);
        continue;
      }
      const spec = parseYaml(raw) as Spec;
      const guidance = await readFile(
        path.join(full, "guidance.md"),
        "utf8",
      ).catch(() => undefined);
      entries.push({
        spec,
        dir: full,
        file: path.relative(ROOT, specFile),
        guidance,
      });
    }
  };
  await walk(root);
  return entries;
}
