/**
 * spec/catalog/** + spec/schema + spec/rules
 *   -> dist/catalog.json           every entry, validated, with shared rules resolved
 *   -> dist/index.json             the light listing search and MCP use
 *   -> dist/rules.json             one rule catalog, one id space
 *   -> dist/components/<id>.json
 *   -> spec/catalog/**\/<id>/SKILL.md   generated from the YAML + optional guidance.md
 *
 * Validation: JSON Schema (ajv) with vocab enums injected; folder and path
 * must match id/catalog/group; cited shared rules must exist; local rule ids
 * must be unique across the catalog; cross-references (instead.use,
 * pairs_well_with, reuses) must resolve; example files must exist. Everything
 * an entry still lacks is listed as `missing` in dist and SKILL.md: reported
 * while the entry is a draft, an error once it is stable.
 *
 * `--check` exits 1 when any committed generated file (SKILL.md) is stale
 * instead of writing it; dist/ is build output and is always written.
 */
import { mkdir, readFile, writeFile, access } from "node:fs/promises";
import path from "node:path";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

import {
  type Rule,
  type Spec,
  type SpecEntry,
  type Vocab,
  CATALOG_DIR,
  DIST_DIR,
  ROOT,
  readSchema,
  readSharedRules,
  readSpecs,
  readVocab,
} from "./lib/spec.ts";

const check = process.argv.includes("--check");
const errors: string[] = [];
const warnings: string[] = [];

function err(entry: SpecEntry | null, msg: string) {
  errors.push(entry ? `${entry.file}: ${msg}` : msg);
}
function warn(entry: SpecEntry | null, msg: string) {
  warnings.push(entry ? `${entry.file}: ${msg}` : msg);
}

async function exists(p: string) {
  return access(p).then(
    () => true,
    () => false,
  );
}

// ---------------------------------------------------------------- validate

function validateStructure(
  entry: SpecEntry,
  vocab: Vocab,
  ids: Set<string>,
  shared: Map<string, Rule>,
  localIds: Map<string, string>,
) {
  const { spec } = entry;
  const rel = path.relative(CATALOG_DIR, entry.dir).split(path.sep);
  const [catalog, group, id] = rel;
  if (id !== spec.id) err(entry, `folder "${id}" must match id "${spec.id}"`);
  if (catalog !== spec.catalog)
    err(
      entry,
      `path catalog "${catalog}" must match catalog "${spec.catalog}"`,
    );
  if (group !== spec.group)
    err(entry, `path group "${group}" must match group "${spec.group}"`);
  const validGroups =
    spec.catalog === "core" ? vocab.groups.core : vocab.groups.ai;
  if (!validGroups[spec.group])
    err(entry, `group "${spec.group}" is not a ${spec.catalog} group`);

  const strict = spec.status === "stable";
  const ref = (kind: string, target: string) => {
    if (ids.has(vocab.component_aliases[target] ?? target)) return;
    const msg = `${kind} references unknown entry "${target}"`;
    strict ? err(entry, msg) : warn(entry, msg);
  };
  for (const i of spec.usage?.instead ?? []) ref("usage.instead", i.use);
  for (const p of spec.usage?.pairs_well_with ?? [])
    ref("usage.pairs_well_with", p);
  for (const r of spec.usage?.reuses ?? []) ref("usage.reuses", r);

  for (const rid of spec.rules?.shared ?? []) {
    if (!shared.has(rid)) err(entry, `cites unknown shared rule ${rid}`);
  }
  for (const r of spec.rules?.local ?? []) {
    if (shared.has(r.id))
      err(entry, `local rule ${r.id} collides with a shared rule`);
    const owner = localIds.get(r.id);
    if (owner && owner !== spec.id)
      err(entry, `local rule ${r.id} already defined by ${owner}`);
    localIds.set(r.id, spec.id);
  }

  for (const t of spec.tokens?.consumes ?? []) {
    const cat = t.split(".")[0];
    if (!vocab.token_categories[cat])
      warn(entry, `token "${t}" uses unknown category "${cat}"`);
  }
}

async function validateFiles(entry: SpecEntry) {
  const strict = entry.spec.status === "stable";
  const all = [
    ...(entry.spec.examples?.good ?? []),
    ...(entry.spec.examples?.anti ?? []),
    ...(entry.spec.implementations ?? []),
  ];
  for (const ex of all) {
    if (!ex.file) continue;
    if (!(await exists(path.join(entry.dir, ex.file)))) {
      (strict ? err : warn)(entry, `missing file ${ex.file}`);
    }
  }
  for (const ex of entry.spec.examples?.anti ?? []) {
    if (!ex.violates?.length)
      err(entry, `anti example "${ex.id}" must cite the rules it violates`);
  }
}

/**
 * What the entry still lacks against the definition of done. Always visible:
 * listed in dist and SKILL.md for every entry, an error for a stable one.
 */
function missingItems(spec: Spec, vocab: Vocab): string[] {
  const m: string[] = [];
  for (const k of ["name", "kind", "tier", "version", "summary"] as const)
    if (spec[k] === undefined) m.push(k);
  const component = spec.kind === "component";
  if (component && spec.catalog === "core" && !spec.atomic_level)
    m.push("atomic_level");
  if (component && !spec.anatomy?.length) m.push("anatomy");

  const states = spec.states ?? [];
  if (!states.length) m.push("states");
  const stateIds = new Set(states.map((s) => s.id));
  const interactive = stateIds.has("hover") || stateIds.has("focus-visible");
  if (component && interactive) {
    const base = Object.entries(vocab.states)
      .filter(([, d]) => d.base)
      .map(([k]) => k)
      .filter((b) => !stateIds.has(b));
    if (base.length)
      m.push(`states: base states ${base.join(", ")} (LQ-STATE-01)`);
  }
  const noTreatment = states.filter((s) => !s.treatment).map((s) => s.id);
  const noA11y = states.filter((s) => !s.a11y).map((s) => s.id);
  if (noTreatment.length) m.push(`states.treatment: ${noTreatment.join(", ")}`);
  if (noA11y.length) m.push(`states.a11y: ${noA11y.join(", ")}`);
  const modes = spec.modes ?? [];
  const modeNoTreatment = modes.filter((s) => !s.treatment).map((s) => s.id);
  const modeNoA11y = modes.filter((s) => !s.a11y).map((s) => s.id);
  if (modeNoTreatment.length)
    m.push(`modes.treatment: ${modeNoTreatment.join(", ")}`);
  if (modeNoA11y.length) m.push(`modes.a11y: ${modeNoA11y.join(", ")}`);

  if (component && !spec.api?.props?.length) m.push("api.props");
  if (!spec.accessibility?.name) m.push("accessibility.name");
  if (component && interactive && !spec.accessibility?.keyboard?.length)
    m.push("accessibility.keyboard");
  if (!spec.usage?.use_when?.length) m.push("usage.use_when");
  const local = spec.rules?.local ?? [];
  if (local.length < 3 || !local.some((r) => r.polarity === "forbid"))
    m.push("rules.local (three or more, at least one forbid)");
  if (component) {
    if (!spec.examples?.good?.length) m.push("examples.good");
    if (!spec.examples?.anti?.length) m.push("examples.anti");
    if (!spec.implementations?.length) m.push("implementations");
  }
  return m;
}

// ---------------------------------------------------------------- render

function table(header: string[], rows: string[][]): string {
  const esc = (s: string) => s.replace(/\|/g, "\\|").replace(/\n/g, " ");
  return [
    `| ${header.join(" | ")} |`,
    `| ${header.map(() => "---").join(" | ")} |`,
    ...rows.map((r) => `| ${r.map(esc).join(" | ")} |`),
  ].join("\n");
}

function renderRule(r: Rule | Omit<Rule, "owner">): string {
  const parts = [
    `- **${r.id}** (${r.level}) ${r.title ? `${r.title}. ` : ""}${r.statement}`,
  ];
  if (r.fix) parts.push(`  Fix: ${r.fix}`);
  return parts.join("\n");
}

const MISSING = "missing";

export function renderSkill(
  entry: SpecEntry,
  shared: Map<string, Rule>,
  missing: string[],
): string {
  const s = entry.spec;
  const name = s.name ?? s.id;
  const out: string[] = [];
  out.push(
    "---",
    `name: lacquer-${s.id}`,
    `description: ${s.summary ?? name}`,
    "---",
    "",
  );
  out.push(`# ${name}`, "");
  const meta = [
    s.kind ?? MISSING,
    `${s.catalog}/${s.group}`,
    s.tier ? `tier ${s.tier}` : `tier ${MISSING}`,
  ];
  if (s.atomic_level) meta.push(s.atomic_level);
  if (s.maturity) meta.push(s.maturity);
  meta.push(`status: ${s.status}`);
  out.push(`> ${s.summary ?? MISSING}`, ">", `> ${meta.join(" · ")}`, "");
  if (s.aliases?.length) out.push(`Also called: ${s.aliases.join(", ")}.`, "");
  if (s.status === "draft") {
    out.push(
      "> **Draft.** Open for work and feedback. Everything under *Missing* is not written yet.",
      "",
    );
  }
  if (missing.length)
    out.push("## Missing", "", ...missing.map((x) => `- ${x}`), "");

  if (entry.guidance) out.push(entry.guidance.trim(), "");

  // Usage
  out.push("## Use it when / not when", "");
  const u = s.usage ?? {};
  for (const x of u.use_when ?? []) out.push(`- Use: ${x}`);
  for (const x of u.avoid_when ?? []) out.push(`- Avoid: ${x}`);
  for (const i of u.instead ?? [])
    out.push(
      `- If ${i.when.charAt(0).toLowerCase()}${i.when.slice(1).replace(/\.$/, "")} → use \`${i.use}\``,
    );
  if (!u.use_when?.length && !u.avoid_when?.length && !u.instead?.length)
    out.push(MISSING);
  if (u.reuses?.length)
    out.push("", `Built from: ${u.reuses.map((r) => `\`${r}\``).join(", ")}.`);
  if (u.pairs_well_with?.length)
    out.push(
      "",
      `Pairs with: ${u.pairs_well_with.map((r) => `\`${r}\``).join(", ")}.`,
    );
  if (u.ai_products_rely_on) out.push("", "AI products rely on this.");
  out.push("");

  if (s.anatomy?.length) {
    out.push(
      "## Anatomy",
      "",
      'Parts in DOM order; each renders with `data-slot="<part>"`.',
      "",
    );
    out.push(
      table(
        ["Part", "Element", "Req.", "Notes"],
        s.anatomy.map((a) => [
          `\`${a.part}\``,
          a.element ?? "",
          a.required === false ? "optional" : "required",
          `${a.slot ? "slot. " : ""}${a.description ?? ""}`,
        ]),
      ),
      "",
    );
  }

  if (s.variants?.length || s.modifiers?.length) {
    out.push("## Variants", "");
    for (const v of s.variants ?? [])
      out.push(
        `- **${v.axis}**: ${v.values.join(" | ")}${v.default ? ` (default \`${v.default}\`)` : ""}${v.guidance ? ` — ${v.guidance}` : ""}`,
      );
    if (s.modifiers?.length) out.push(`- Modifiers: ${s.modifiers.join(", ")}`);
    out.push("");
  }

  if (s.machine) {
    out.push(
      "## Lifecycle",
      "",
      `Initial state: \`${s.machine.initial ?? s.machine.states[0]?.id}\`.`,
      "",
    );
    out.push(
      table(
        ["State", "User sees", "Composer", "Announcement"],
        s.machine.states.map((m) => [
          `\`${m.id}\`${m.terminal ? " (terminal)" : ""}`,
          m.user_sees ?? "",
          m.composer_control ?? "",
          m.announcement ?? "",
        ]),
      ),
      "",
    );
    out.push(
      "Transitions: " +
        s.machine.transitions
          .map((t) => `${t.from} →(${t.on}) ${t.to}`)
          .join("; ") +
        ".",
      "",
    );
  }

  out.push(
    "## States",
    "",
    "Every listed state needs a visual treatment **and** an accessibility expression (or an explicit none). No state by colour alone.",
    "",
  );
  if (s.states?.length) {
    out.push(
      table(
        ["State", "Treatment", "A11y", "Notes"],
        s.states.map((st) => [
          `\`${st.id}\`${st.required === false ? " (opt.)" : ""}`,
          st.treatment ?? MISSING,
          st.a11y ?? MISSING,
          st.notes ?? "",
        ]),
      ),
      "",
    );
  } else out.push(MISSING, "");

  if (s.modes?.length) {
    out.push(
      "## Modes",
      "",
      "Component-specific display modes. Same contract as states: a treatment and an a11y expression each.",
      "",
    );
    out.push(
      table(
        ["Mode", "Treatment", "A11y", "Notes"],
        s.modes.map((m) => [
          `\`${m.id}\``,
          m.treatment ?? MISSING,
          m.a11y ?? MISSING,
          m.notes ?? "",
        ]),
      ),
      "",
    );
  }

  if (
    s.api?.props?.length ||
    s.api?.interactions !== undefined ||
    s.api?.composition
  ) {
    out.push("## API (framework-neutral)", "");
    if (s.api.props?.length)
      out.push(
        table(
          ["Prop", "Type", "Default", "Maps to", "Notes"],
          s.api.props.map((p) => [
            `\`${p.name}\`${p.required ? "*" : ""}`,
            `\`${p.type}\``,
            p.default === undefined ? "" : `\`${String(p.default)}\``,
            p.maps_to ?? "",
            p.description ?? "",
          ]),
        ),
        "",
      );
    if (s.api.slots?.length)
      out.push(`Slots: ${s.api.slots.map((x) => `\`${x}\``).join(", ")}.`);
    if (s.api.events?.length)
      out.push(
        `Events: ${s.api.events.map((e) => `\`${e.name}\``).join(", ")}.`,
      );
    if (s.api.interactions !== undefined) {
      out.push("", "Interactions:");
      if (s.api.interactions.length)
        out.push(...s.api.interactions.map((i) => `- ${i}`));
      else out.push("- none");
    }
    if (s.api.composition) out.push("", s.api.composition.trim());
    out.push("");
  }

  const a = s.accessibility ?? {};
  out.push("## Accessibility", "");
  if (a.apg?.pattern)
    out.push(
      `- APG pattern: ${a.apg.url ? `[${a.apg.pattern}](${a.apg.url})` : a.apg.pattern}`,
    );
  if (a.role) out.push(`- Role: ${a.role}`);
  out.push(`- Accessible name: ${a.name ?? MISSING}`);
  for (const x of a.aria ?? [])
    out.push(
      `- \`${x.attr}\`${x.on ? ` on ${x.on}` : ""}${x.value ? ` = ${x.value}` : ""}${x.when ? ` when ${x.when}` : ""}`,
    );
  if (a.keyboard?.length)
    out.push(
      "",
      table(
        ["Key", "Action"],
        a.keyboard.map((k) => [
          `\`${k.key}\``,
          `${k.action}${k.when ? ` (${k.when})` : ""}`,
        ]),
      ),
    );
  if (a.focus) out.push("", `Focus: ${a.focus}`);
  if (a.announcements) out.push("", `Announcements: ${a.announcements}`);
  if (a.notes) out.push("", a.notes);
  out.push("");

  if (s.tokens?.consumes?.length || s.tokens?.defines?.length) {
    out.push(
      "## Tokens",
      "",
      "Roles, not values. Resolve through the binding (spec/bindings/html.yaml) to CSS custom properties.",
      "",
    );
    if (s.tokens.consumes?.length)
      out.push(
        `Consumes: ${s.tokens.consumes.map((t) => `\`${t}\``).join(", ")}.`,
      );
    if (s.tokens.defines?.length)
      out.push(
        `Defines: ${s.tokens.defines.map((t) => `\`${t}\``).join(", ")}.`,
      );
    out.push("");
  }

  if (s.content) {
    out.push("## Content", "");
    if (s.content.label) out.push(`- Label: ${s.content.label}`);
    if (s.content.voice) out.push(`- Voice: ${s.content.voice}`);
    if (s.content.limits) out.push(`- Never: ${s.content.limits}`);
    if (s.content.strings)
      out.push(
        `- Default strings: ${Object.entries(s.content.strings)
          .map(([k, v]) => `${k}="${v}"`)
          .join(", ")}`,
      );
    out.push("");
  }

  const sharedRules = (s.rules?.shared ?? [])
    .map((id) => shared.get(id)!)
    .filter(Boolean);
  const local = s.rules?.local ?? [];
  const must = [...sharedRules, ...local].filter(
    (r) => r.polarity === "require",
  );
  const forbid = [...sharedRules, ...local].filter(
    (r) => r.polarity === "forbid",
  );
  out.push(
    "## Rules",
    "",
    "What the grader enforces. MUST = defect, SHOULD = deduction.",
    "",
  );
  if (must.length) out.push("### Required", "", ...must.map(renderRule), "");
  if (forbid.length)
    out.push("### Forbidden", "", ...forbid.map(renderRule), "");
  if (!must.length && !forbid.length) out.push(MISSING, "");

  if (s.examples?.good?.length || s.examples?.anti?.length) {
    out.push("## Examples", "");
    for (const e of s.examples.good ?? [])
      out.push(
        `- ${e.title ?? e.id} — \`${e.file}${e.export ? `#${e.export}` : ""}\`${e.demonstrates?.length ? ` (${e.demonstrates.join(", ")})` : ""}`,
      );
    for (const e of s.examples.anti ?? [])
      out.push(
        `- ✗ ${e.title ?? e.id} — \`${e.file}\` violates ${e.violates!.join(", ")}`,
      );
    out.push("");
  }
  if (s.implementations?.length) {
    out.push("## Implementations", "");
    for (const i of s.implementations)
      out.push(
        `- ${i.renderer}: \`${i.package ? `${i.package}${i.export ? `#${i.export}` : ""}` : i.file}\`${i.status ? ` (${i.status})` : ""}`,
      );
    out.push("");
  }
  if (u.exemplars?.length)
    out.push("## Exemplars", "", ...u.exemplars.map((x) => `- ${x}`), "");
  if (s.sources?.length)
    out.push("## Sources", "", ...s.sources.map((x) => `- ${x}`), "");
  return (
    out
      .join("\n")
      .replace(/\n{3,}/g, "\n\n")
      .trimEnd() + "\n"
  );
}

// ---------------------------------------------------------------- emit

let stale = 0;
async function emit(file: string, content: string) {
  const current = await readFile(file, "utf8").catch(() => "");
  if (current === content) return;
  if (check && !file.startsWith(DIST_DIR)) {
    stale++;
    console.error(`stale: ${path.relative(ROOT, file)}`);
    return;
  }
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, content);
}

async function main() {
  const vocab = await readVocab();
  const schema = await readSchema(vocab);
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(ajv);
  const validate = ajv.compile(schema);

  const sharedList = await readSharedRules();
  const shared = new Map(sharedList.map((r) => [r.id, r]));
  const entries = await readSpecs();
  const ids = new Set(entries.map((e) => e.spec.id));
  const dupes = entries
    .map((e) => e.spec.id)
    .filter((id, i, arr) => arr.indexOf(id) !== i);
  for (const d of dupes) err(null, `duplicate id "${d}"`);

  const localIds = new Map<string, string>();
  const missing = new Map<string, string[]>();
  for (const entry of entries) {
    if (!validate(entry.spec)) {
      for (const e of validate.errors ?? [])
        err(
          entry,
          `${e.instancePath || "/"} ${e.message}${e.params && "allowedValues" in e.params ? ` (${(e.params.allowedValues as string[]).slice(0, 8).join(", ")}…)` : ""}`,
        );
      continue;
    }
    validateStructure(entry, vocab, ids, shared, localIds);
    await validateFiles(entry);
    const m = missingItems(entry.spec, vocab);
    missing.set(entry.spec.id, m);
    if (entry.spec.status === "stable")
      for (const x of m) err(entry, `stable entry is missing ${x}`);
  }

  if (errors.length) {
    console.error(`\n${errors.length} error(s):`);
    for (const e of errors) console.error(`  ${e}`);
    process.exit(1);
  }

  // Resolve and emit.
  const allRules: Rule[] = [...sharedList];
  for (const entry of entries)
    for (const r of entry.spec.rules?.local ?? [])
      allRules.push({ ...r, owner: entry.spec.id });

  const gaps = new Map<string, string[]>();
  const components = entries.map((entry) => {
    const s = entry.spec;
    for (const r of s.usage?.reuses ?? [])
      if (!ids.has(vocab.component_aliases[r] ?? r))
        gaps.set(r, [...(gaps.get(r) ?? []), s.id]);
    return {
      ...s,
      path: path.relative(ROOT, entry.dir),
      skill: path.relative(ROOT, path.join(entry.dir, "SKILL.md")),
      rules: {
        ...(s.rules ?? {}),
        resolved: [
          ...(s.rules?.shared ?? []).map((id) => shared.get(id)!),
          ...(s.rules?.local ?? []).map((r) => ({ ...r, owner: s.id })),
        ],
      },
      missing: missing.get(s.id) ?? [],
    };
  });

  const byStatus: Record<string, number> = {};
  for (const c of components)
    byStatus[c.status] = (byStatus[c.status] ?? 0) + 1;
  const gapCount = components.reduce((n, c) => n + c.missing.length, 0);
  const withGaps = components.filter((c) => c.missing.length).length;

  const catalog = {
    $schema: "https://lacquer.dev/schema/catalog.json",
    version: 1,
    generated_at: new Date().toISOString().slice(0, 10),
    counts: {
      total: components.length,
      by_status: byStatus,
      by_catalog: {
        core: components.filter((c) => c.catalog === "core").length,
        ai: components.filter((c) => c.catalog === "ai").length,
      },
      rules: allRules.length,
      missing: gapCount,
    },
    gaps: Object.fromEntries(
      [...gaps].map(([k, v]) => [
        k,
        {
          referenced_by: v,
          note: "Referenced via usage.reuses but not in the catalog. Add an entry or alias it in vocab.component_aliases.",
        },
      ]),
    ),
    components,
  };
  const index = components.map((c) => ({
    id: c.id,
    name: c.name ?? c.id,
    kind: c.kind,
    catalog: c.catalog,
    group: c.group,
    tier: c.tier,
    status: c.status,
    maturity: c.maturity,
    summary: c.summary ?? "",
    aliases: c.aliases ?? [],
    missing: c.missing.length,
    path: c.path,
    skill: c.skill,
  }));

  const json = (v: unknown) => `${JSON.stringify(v, null, 2)}\n`;
  await emit(path.join(DIST_DIR, "catalog.json"), json(catalog));
  await emit(path.join(DIST_DIR, "index.json"), json(index));
  await emit(
    path.join(DIST_DIR, "rules.json"),
    json({ version: 2, count: allRules.length, rules: allRules }),
  );
  for (const c of components)
    await emit(path.join(DIST_DIR, "components", `${c.id}.json`), json(c));
  for (const entry of entries)
    await emit(
      path.join(entry.dir, "SKILL.md"),
      renderSkill(entry, shared, missing.get(entry.spec.id) ?? []),
    );

  if (warnings.length) {
    console.warn(`\n${warnings.length} warning(s):`);
    for (const w of warnings.slice(0, 40)) console.warn(`  ${w}`);
    if (warnings.length > 40) console.warn(`  … ${warnings.length - 40} more`);
  }
  console.log(
    `\n${components.length} entries (${JSON.stringify(byStatus)}), ${allRules.length} rules, ${gaps.size} catalog gap(s): ${[...gaps.keys()].join(", ") || "none"}`,
  );
  console.log(
    `${withGaps} entries list ${gapCount} missing item(s); see each SKILL.md or dist/components/<id>.json → missing`,
  );
  if (check && stale) {
    console.error(`\n${stale} generated file(s) out of date. Run: pnpm build`);
    process.exit(1);
  }
}

if (import.meta.main ?? process.argv[1]?.endsWith("build-spec.ts"))
  await main();
