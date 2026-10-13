/**
 * Shared readers for the spec layer (spec/). The spec is the framework-agnostic
 * source of truth: one YAML per catalog entry under spec/catalog/<catalog>/<group>/<id>/,
 * validated against spec/schema/component.schema.json with enums injected from
 * spec/schema/vocab.yaml. Shared rules live in spec/rules/*.yaml. Everything in
 * spec/dist and every SKILL.md next to a spec is generated from these files.
 */
import { readdir, readFile, stat } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { parse as parseYaml } from "yaml"

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..")
export const SPEC_DIR = path.join(ROOT, "spec")
export const CATALOG_DIR = path.join(SPEC_DIR, "catalog")
export const SCHEMA_FILE = path.join(SPEC_DIR, "schema", "component.schema.json")
export const VOCAB_FILE = path.join(SPEC_DIR, "schema", "vocab.yaml")
export const SPEC_RULES_DIR = path.join(SPEC_DIR, "rules")
export const DIST_DIR = path.join(SPEC_DIR, "dist")

export interface Vocab {
  kinds: Record<string, string>
  catalogs: Record<string, string>
  groups: { core: Record<string, string>; ai: Record<string, string> }
  tiers: Record<string, string>
  atomic_levels: string[]
  maturity: string[]
  status: Record<string, string>
  states: Record<string, { base?: boolean; ai?: boolean; meaning?: string; aliases?: string[] }>
  token_categories: Record<string, string>
  component_aliases: Record<string, string>
  renderers: Record<string, string>
  rule_levels: Record<string, string>
}

export interface Rule {
  id: string
  level: "MUST" | "SHOULD" | "MAY"
  polarity: "require" | "forbid"
  title?: string
  statement: string
  rationale?: string
  detect?: { static?: string; runtime?: string }
  fix?: string
  applies_to?: string[]
  source?: string
  /** AI-loop phase. */
  phase?: string
  /** Where the rule is defined: "shared" or the catalog id that owns it. */
  owner: string
  file?: string
}

// A spec entry, loosely typed: the schema is the contract, this is just enough
// for the build to navigate it. Only id, catalog, group and status are
// guaranteed while an entry is a draft.
export interface Spec {
  id: string
  name?: string
  kind?: string
  catalog: string
  group: string
  tier?: number
  atomic_level?: string
  maturity?: string
  status: string
  version?: string
  summary?: string
  aliases?: string[]
  found_in?: string[]
  anatomy?: { part: string; element?: string; required?: boolean; slot?: boolean; description?: string }[]
  variants?: { axis: string; values: string[]; default?: string; guidance?: string }[]
  modifiers?: string[]
  states?: { id: string; required?: boolean; treatment?: string; a11y?: string; notes?: string }[]
  modes?: { id: string; treatment?: string; a11y?: string; notes?: string }[]
  machine?: {
    initial?: string
    states: { id: string; terminal?: boolean; user_sees?: string; composer_control?: string; announcement?: string }[]
    transitions: { from: string; to: string; on: string }[]
  }
  api?: {
    props?: { name: string; type: string; default?: unknown; required?: boolean; description?: string; maps_to?: string }[]
    slots?: string[]
    events?: { name: string; payload?: string; description?: string }[]
    interactions?: string[]
    composition?: string
  }
  accessibility?: {
    apg?: { pattern?: string; url?: string }
    role?: string
    name?: string
    aria?: { attr: string; on?: string; when?: string; value?: string }[]
    keyboard?: { key: string; action: string; when?: string }[]
    focus?: string
    announcements?: string
    notes?: string
  }
  tokens?: { consumes?: string[]; defines?: string[] }
  content?: { label?: string; voice?: string; limits?: string; strings?: Record<string, string> }
  usage?: {
    use_when?: string[]
    avoid_when?: string[]
    instead?: { when: string; use: string }[]
    pairs_well_with?: string[]
    reuses?: string[]
    exemplars?: string[]
    ai_products_rely_on?: boolean
  }
  rules?: { shared?: string[]; local?: Omit<Rule, "owner">[] }
  examples?: { good?: Example[]; anti?: Example[] }
  implementations?: { renderer: string; file: string; status?: string }[]
  grading?: { weight?: number; notes?: string }
  sources?: string[]
}

export interface Example {
  id: string
  title?: string
  renderer: string
  file: string
  export?: string
  description?: string
  demonstrates?: string[]
  violates?: string[]
}

export interface SpecEntry {
  spec: Spec
  /** Absolute folder of the entry. */
  dir: string
  /** Path of the YAML relative to the repo root. */
  file: string
  /** Hand-written prose merged into SKILL.md, if guidance.md exists. */
  guidance?: string
}

export async function readVocab(file = VOCAB_FILE): Promise<Vocab> {
  return parseYaml(await readFile(file, "utf8")) as Vocab
}

/** The schema with every `x-vocab` marker replaced by the vocab's enum. */
export async function readSchema(vocab: Vocab, file = SCHEMA_FILE): Promise<Record<string, unknown>> {
  const schema = JSON.parse(await readFile(file, "utf8"))
  const enums: Record<string, string[]> = {
    kinds: Object.keys(vocab.kinds),
    catalogs: Object.keys(vocab.catalogs),
    groups: [...Object.keys(vocab.groups.core), ...Object.keys(vocab.groups.ai)],
    atomic_levels: vocab.atomic_levels,
    maturity: vocab.maturity,
    status: Object.keys(vocab.status),
    states: Object.keys(vocab.states),
    renderers: Object.keys(vocab.renderers),
    rule_levels: Object.keys(vocab.rule_levels),
  }
  const walk = (node: unknown): void => {
    if (Array.isArray(node)) return node.forEach(walk)
    if (typeof node !== "object" || node === null) return
    const obj = node as Record<string, unknown>
    if (typeof obj["x-vocab"] === "string") {
      const key = obj["x-vocab"] as string
      if (!enums[key]) throw new Error(`schema references unknown vocab "${key}"`)
      obj.enum = enums[key]
      delete obj["x-vocab"]
    }
    Object.values(obj).forEach(walk)
  }
  walk(schema)
  return schema
}

/** Shared rules: every spec/rules/*.yaml, in file order. */
export async function readSharedRules(): Promise<Rule[]> {
  const rules: Rule[] = []
  for (const entry of (await readdir(SPEC_RULES_DIR)).sort()) {
    if (!entry.endsWith(".yaml")) continue
    const doc = parseYaml(await readFile(path.join(SPEC_RULES_DIR, entry), "utf8")) as { rules: Omit<Rule, "owner">[] }
    for (const r of doc.rules) rules.push({ ...r, owner: "shared", file: `spec/rules/${entry}` })
  }
  return rules
}

/** Every spec under spec/catalog, in path order. */
export async function readSpecs(root = CATALOG_DIR): Promise<SpecEntry[]> {
  const entries: SpecEntry[] = []
  const walk = async (dir: string): Promise<void> => {
    for (const name of (await readdir(dir)).sort()) {
      const full = path.join(dir, name)
      if (!(await stat(full)).isDirectory()) continue
      const specFile = path.join(full, `${name}.yaml`)
      let raw: string | null = null
      try {
        raw = await readFile(specFile, "utf8")
      } catch {
        await walk(full)
        continue
      }
      const spec = parseYaml(raw) as Spec
      const guidance = await readFile(path.join(full, "guidance.md"), "utf8").catch(() => undefined)
      entries.push({ spec, dir: full, file: path.relative(ROOT, specFile), guidance })
    }
  }
  await walk(root)
  return entries
}
