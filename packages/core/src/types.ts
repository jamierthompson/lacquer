/**
 * Types for the Lacquer catalog. A spec is one YAML entry under
 * spec/catalog/<catalog>/<group>/<id>/; the build validates it against
 * spec/schema/component.schema.json and compiles dist/.
 */

export interface Vocab {
  kinds: Record<string, string>;
  catalogs: Record<string, string>;
  groups: { core: Record<string, string>; ai: Record<string, string> };
  tiers: Record<string, string>;
  atomic_levels: string[];
  maturity: string[];
  status: Record<string, string>;
  states: Record<
    string,
    { base?: boolean; ai?: boolean; meaning?: string; aliases?: string[] }
  >;
  token_categories: Record<string, string>;
  component_aliases: Record<string, string>;
  renderers: Record<string, string>;
  rule_levels: Record<string, string>;
}

export interface Rule {
  id: string;
  level: "MUST" | "SHOULD" | "MAY";
  polarity: "require" | "forbid";
  title?: string;
  statement: string;
  rationale?: string;
  detect?: { static?: string; runtime?: string };
  fix?: string;
  applies_to?: string[];
  source?: string;
  /** AI-loop phase. */
  phase?: string;
  /** Where the rule is defined: "shared" or the catalog id that owns it. */
  owner: string;
  file?: string;
}

export interface Example {
  id: string;
  title?: string;
  renderer: string;
  file: string;
  export?: string;
  description?: string;
  demonstrates?: string[];
  violates?: string[];
}

// A spec entry, loosely typed: the schema is the contract, this is just enough
// to navigate it. Only id, catalog, group and status are guaranteed while an
// entry is a draft.
export interface Spec {
  id: string;
  name?: string;
  kind?: string;
  catalog: string;
  group: string;
  tier?: number;
  atomic_level?: string;
  maturity?: string;
  status: string;
  version?: string;
  summary?: string;
  aliases?: string[];
  found_in?: string[];
  anatomy?: {
    part: string;
    element?: string;
    required?: boolean;
    slot?: boolean;
    description?: string;
  }[];
  variants?: {
    axis: string;
    values: string[];
    default?: string;
    guidance?: string;
  }[];
  modifiers?: string[];
  states?: {
    id: string;
    required?: boolean;
    treatment?: string;
    a11y?: string;
    notes?: string;
  }[];
  modes?: { id: string; treatment?: string; a11y?: string; notes?: string }[];
  machine?: {
    initial?: string;
    states: {
      id: string;
      terminal?: boolean;
      user_sees?: string;
      composer_control?: string;
      announcement?: string;
    }[];
    transitions: { from: string; to: string; on: string }[];
  };
  api?: {
    props?: {
      name: string;
      type: string;
      default?: unknown;
      required?: boolean;
      description?: string;
      maps_to?: string;
    }[];
    slots?: string[];
    events?: { name: string; payload?: string; description?: string }[];
    interactions?: string[];
    composition?: string;
  };
  accessibility?: {
    apg?: { pattern?: string; url?: string };
    role?: string;
    name?: string;
    aria?: { attr: string; on?: string; when?: string; value?: string }[];
    keyboard?: { key: string; action: string; when?: string }[];
    focus?: string;
    announcements?: string;
    notes?: string;
  };
  tokens?: { consumes?: string[]; defines?: string[] };
  content?: {
    label?: string;
    voice?: string;
    limits?: string;
    strings?: Record<string, string>;
  };
  usage?: {
    use_when?: string[];
    avoid_when?: string[];
    instead?: { when: string; use: string }[];
    pairs_well_with?: string[];
    reuses?: string[];
    exemplars?: string[];
    ai_products_rely_on?: boolean;
  };
  rules?: { shared?: string[]; local?: Omit<Rule, "owner">[] };
  examples?: { good?: Example[]; anti?: Example[] };
  implementations?: { renderer: string; file: string; status?: string }[];
  grading?: { weight?: number; notes?: string };
  sources?: string[];
}

/** One entry as compiled into dist/components/<id>.json. */
export interface CatalogComponent extends Spec {
  /** Entry folder, relative to the package root. */
  path: string;
  /** Generated SKILL.md, relative to the package root. */
  skill: string;
  rules: Spec["rules"] & { resolved: Rule[] };
  /** What the entry still lacks against the definition of done. */
  missing: string[];
}

/** dist/catalog.json */
export interface Catalog {
  $schema: string;
  version: number;
  generated_at: string;
  counts: {
    total: number;
    by_status: Record<string, number>;
    by_catalog: { core: number; ai: number };
    rules: number;
    missing: number;
  };
  gaps: Record<string, { referenced_by: string[]; note: string }>;
  components: CatalogComponent[];
}

/** One row of dist/index.json. */
export interface IndexEntry {
  id: string;
  name: string;
  kind?: string;
  catalog: string;
  group: string;
  tier?: number;
  status: string;
  maturity?: string;
  summary: string;
  aliases: string[];
  missing: number;
  path: string;
  skill: string;
}

/** dist/rules.json */
export interface RuleCatalog {
  version: number;
  count: number;
  rules: Rule[];
}
