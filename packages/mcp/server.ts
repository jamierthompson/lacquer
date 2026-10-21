/**
 * Lacquer MCP server.
 *
 * Run it from the workspace root:
 *   pnpm build
 *   pnpm mcp
 * and point a client at it over stdio.
 *
 * The server is deliberately dumb: it reads @lacquer/core's dist/ that the build
 * validated and answers questions about it. All intelligence lives in the
 * catalog data — the same files feed the skills, the site and, later, the grader.
 */
import { readFile } from "node:fs/promises";
import {
  type IndexEntry,
  loadComponent,
  loadIndex,
  loadRules,
  type Rule,
  resolvePath,
} from "@lacquer/core";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { parse as parseYaml } from "yaml";
import { z } from "zod";

const index = await loadIndex();
const { rules } = await loadRules();
const component = loadComponent;
const text = (v: unknown) => ({
  content: [
    {
      type: "text" as const,
      text: typeof v === "string" ? v : JSON.stringify(v, null, 2),
    },
  ],
});

const server = new McpServer({ name: "lacquer", version: "0.1.0" });

server.tool(
  "lacquer_search",
  "Find the right component or pattern for a UI need. Matches name, aliases, summary and group. Use before building any control, surface or AI-interface element.",
  {
    query: z.string(),
    catalog: z.enum(["core", "ai"]).optional(),
    group: z.string().optional(),
    tier: z.number().int().min(1).max(3).optional(),
    limit: z.number().int().default(10),
  },
  async ({ query, catalog, group, tier, limit }) => {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    const scored = index
      .filter(
        (e) =>
          (!catalog || e.catalog === catalog) &&
          (!group || e.group === group) &&
          (!tier || e.tier === tier),
      )
      .map((e) => {
        const hay = {
          id: e.id,
          name: e.name.toLowerCase(),
          aliases: e.aliases.join(" ").toLowerCase(),
          summary: e.summary.toLowerCase(),
          group: e.group,
        };
        let score = 0;
        for (const t of terms) {
          if (hay.id === t) score += 10;
          else if (hay.id.includes(t) || hay.name.includes(t)) score += 5;
          if (hay.aliases.includes(t)) score += 4;
          if (hay.summary.includes(t)) score += 2;
          if (hay.group.includes(t)) score += 1;
        }
        return { ...e, score };
      })
      .filter((e) => e.score > 0)
      .sort((a, b) => b.score - a.score || a.tier - b.tier)
      .slice(0, limit);
    return text(
      scored.map(({ aliases: _a, path: _p, skill: _s, ...rest }) => rest),
    );
  },
);

server.tool(
  "lacquer_get",
  "Full spec for one entry: anatomy, variants, states with treatments and ARIA, API, keyboard, token roles, content rules, usage and resolved rules. format=skill returns the SKILL.md.",
  { id: z.string(), format: z.enum(["json", "skill"]).default("json") },
  async ({ id, format }) => {
    const entry = index.find((e) => e.id === id);
    if (!entry)
      return text({ error: `unknown id "${id}"`, hint: "use lacquer_search" });
    if (format === "skill")
      return text(await readFile(resolvePath(entry.skill), "utf8"));
    return text(await component(id));
  },
);

server.tool(
  "lacquer_decide",
  "Decision rule for choosing between candidate ids (dialog vs drawer, select vs combobox). Draws on each entry's usage.instead and avoid_when.",
  { candidates: z.array(z.string()).min(1) },
  async ({ candidates }) => {
    const out = [];
    for (const id of candidates) {
      const c = await component(id).catch(() => null);
      if (!c) {
        out.push({ id, error: "unknown" });
        continue;
      }
      out.push({
        id,
        summary: c.summary,
        use_when: c.usage.use_when,
        avoid_when: c.usage.avoid_when,
        instead: c.usage.instead,
      });
    }
    return text(out);
  },
);

server.tool(
  "lacquer_rules",
  "Rules that apply to a component, a group, or everything (omit both). Each has id, level, polarity, statement, detection and fix.",
  {
    id: z.string().optional(),
    group: z.string().optional(),
    polarity: z.enum(["require", "forbid"]).optional(),
    level: z.enum(["MUST", "SHOULD", "MAY"]).optional(),
  },
  async ({ id, group, polarity, level }) => {
    let list: Rule[];
    if (id) list = (await component(id)).rules.resolved;
    else if (group)
      list = rules.filter(
        (r) =>
          r.owner === "shared" &&
          (r.applies_to ?? ["*"]).some(
            (a) => a === "*" || a === `group:${group}`,
          ),
      );
    else list = rules.filter((r) => r.owner === "shared");
    return text(
      list.filter(
        (r) =>
          (!polarity || r.polarity === polarity) &&
          (!level || r.level === level),
      ),
    );
  },
);

server.tool(
  "lacquer_example",
  "Example code for a component in a renderer. kind=anti returns forbidden usage with the rules it breaks.",
  {
    id: z.string(),
    renderer: z.string().default("html"),
    kind: z.enum(["good", "anti", "all"]).default("good"),
  },
  async ({ id, renderer, kind }) => {
    const c = await component(id).catch(() => null);
    if (!c) return text({ error: `unknown id "${id}"` });
    const pick = [
      ...(kind !== "anti" ? (c.examples?.good ?? []) : []),
      ...(kind !== "good" ? (c.examples?.anti ?? []) : []),
    ].filter((e: { renderer: string }) => e.renderer === renderer);
    const out = [];
    for (const e of pick)
      out.push({
        ...e,
        code: await readFile(resolvePath(`${c.path}/${e.file}`), "utf8"),
      });
    return text(
      out.length
        ? out
        : {
            note: `no ${kind} examples for ${id} in ${renderer} yet`,
            status: c.status,
          },
    );
  },
);

server.tool(
  "lacquer_tokens",
  "Resolve token roles (or a component's consumed roles) to CSS custom property names through a binding.",
  {
    roles: z.array(z.string()).optional(),
    id: z.string().optional(),
    binding: z.string().default("html"),
  },
  async ({ roles, id, binding }) => {
    const b = parseYaml(
      await readFile(resolvePath(`spec/bindings/${binding}.yaml`), "utf8"),
    ) as { roles: Record<string, { var: string }> };
    const wanted =
      roles ?? (id ? ((await component(id)).tokens?.consumes ?? []) : []);
    return text(
      Object.fromEntries(
        wanted.map((r: string) => [r, b.roles[r] ?? { unresolved: true }]),
      ),
    );
  },
);

server.tool(
  "lacquer_catalog",
  "Overview: groups, tiers, counts by status, and the Tier 1 starter set for a product type.",
  {
    product_type: z
      .enum(["classic", "ai-augmented", "ai-native"])
      .default("classic"),
  },
  async ({ product_type }) => {
    const augmented = [
      "ai-label",
      "selection-ai-menu",
      "generate-button",
      "ai-summary-card",
      "context-chips",
      "feedback-control",
      "data-use-notice",
    ];
    const tier1core = index
      .filter((e) => e.catalog === "core" && e.tier === 1)
      .map((e) => e.id);
    const tier1ai = index
      .filter((e) => e.catalog === "ai" && e.tier === 1)
      .map((e) => e.id);
    const starter =
      product_type === "classic"
        ? tier1core
        : product_type === "ai-augmented"
          ? [...tier1core, ...augmented]
          : [...tier1core, ...tier1ai];
    const by = (k: keyof IndexEntry) =>
      index.reduce<Record<string, number>>((m, e) => {
        const key = String(e[k]);
        m[key] = (m[key] ?? 0) + 1;
        return m;
      }, {});
    return text({
      total: index.length,
      by_catalog: by("catalog"),
      by_group: by("group"),
      by_status: by("status"),
      starter_set: starter,
    });
  },
);

await server.connect(new StdioServerTransport());
