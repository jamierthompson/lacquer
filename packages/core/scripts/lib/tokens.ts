/**
 * The token layer: spec/tokens/*.tokens.json in the DTCG Format Module
 * 2025.10, composed by spec/tokens/lacquer.resolver.json (Resolver Module
 * 2025.10) into one tree per theme context.
 *
 * A role is a token's path (`color.bg.primary`). Nothing else names it: the
 * html binding derives `--lq-color-bg-primary` from the path, the tailwind
 * binding derives `--color-lq-bg-primary` and `bg-lq-bg-primary` from the
 * path and the `$type`, and every value is written once, here. The build
 * reads this file set, validates it, derives both bindings, compiles
 * dist/bindings.json and generates the two theme stylesheets.
 *
 * Lacquer's own data rides in `$extensions["dev.lacquer"]`:
 *   on a group:  `shorthand: "padding"`   the group is one role whose value is
 *                                         its `block` and `inline` children
 *   on a token:  `unit: "ch"`             a number read as a CSS length in a
 *                                         unit the dimension type lacks
 *                `tailwind: { namespace?, class?, property? }`
 *                                         overrides for the derived binding
 */
import { readFile } from "node:fs/promises";
import path from "node:path";

import type { Binding, BindingRole, Theme } from "../../src/types.ts";
import { SPEC_DIR } from "./spec.ts";

export const TOKENS_DIR = path.join(SPEC_DIR, "tokens");
export const RESOLVER_FILE = path.join(TOKENS_DIR, "lacquer.resolver.json");
export const BINDINGS_DIR = path.join(SPEC_DIR, "bindings");
export const HTML_THEME_FILE = path.join(BINDINGS_DIR, "html.theme.css");
export const TAILWIND_THEME_FILE = path.join(
  BINDINGS_DIR,
  "tailwind.theme.css",
);

/** The `--lq-` prefix every html binding property carries. */
export const LQ_PREFIX = "--lq-";
const EXT = "dev.lacquer";

// ---------------------------------------------------------------- DTCG types

export type TokenType =
  | "color"
  | "dimension"
  | "duration"
  | "number"
  | "fontFamily"
  | "fontWeight"
  | "cubicBezier"
  | "shadow"
  | "typography"
  /** Lacquer: a padding shorthand group (see the file header). */
  | "shorthand";

const TYPES = new Set<string>([
  "color",
  "dimension",
  "duration",
  "number",
  "fontFamily",
  "fontWeight",
  "cubicBezier",
  "shadow",
  "typography",
]);

interface Color {
  colorSpace: string;
  components: (number | "none")[];
  alpha?: number;
  hex?: string;
}
interface Dimension {
  value: number;
  unit: "px" | "rem";
}
interface Duration {
  value: number;
  unit: "ms" | "s";
}
interface Shadow {
  color: Color | string;
  offsetX: Dimension | string;
  offsetY: Dimension | string;
  blur: Dimension | string;
  spread: Dimension | string;
  inset?: boolean;
}
interface Typography {
  fontFamily: string | string[];
  fontSize: Dimension | string;
  fontWeight: number | string;
  /** Required by DTCG; always 0 here, see checkShape. */
  letterSpacing: Dimension | string;
  lineHeight: number | string;
}

export interface LacquerExtensions {
  shorthand?: "padding";
  unit?: string;
  tailwind?: { namespace?: string | null; class?: string; property?: string };
}

/** One role, after resolution: its type and its metadata. Values live in TokenSet.values. */
export interface Token {
  role: string;
  path: string[];
  type: TokenType;
  description?: string;
  deprecated?: boolean | string;
  ext: LacquerExtensions;
}

type Node = Record<string, unknown>;

// ---------------------------------------------------------------- resolver

interface Resolver {
  version: string;
  sets: Record<string, { sources: { $ref: string }[] }>;
  modifiers: Record<
    string,
    { contexts: Record<string, { $ref: string }[]>; default?: string }
  >;
  resolutionOrder: { $ref: string }[];
}

const readJson = async (file: string) =>
  JSON.parse(await readFile(file, "utf8")) as Node;

const isObject = (v: unknown): v is Node =>
  !!v && typeof v === "object" && !Array.isArray(v);

/** Deep merge: later wins, objects merge, everything else replaces. */
function merge(into: Node, from: Node): Node {
  for (const [key, value] of Object.entries(from)) {
    const current = into[key];
    into[key] =
      isObject(value) && isObject(current)
        ? merge({ ...current }, value)
        : value;
  }
  return into;
}

/**
 * The resolver's contexts (`theme` → light | dark), default first; the
 * merged token tree for each input `{ theme: <context> }`; and, per
 * context, the tree of only what its own sources set (its overrides).
 */
export async function readTokenTrees(file = RESOLVER_FILE): Promise<{
  contexts: string[];
  trees: Record<string, Node>;
  overrides: Record<string, Node>;
}> {
  const resolver = (await readJson(file)) as unknown as Resolver;
  if (resolver.version !== "2025.10")
    throw new Error(`resolver: version ${resolver.version} is not 2025.10`);
  const dir = path.dirname(file);
  const load = async (sources: { $ref: string }[]) => {
    const tree: Node = {};
    for (const s of sources)
      merge(tree, await readJson(path.join(dir, s.$ref)));
    return tree;
  };
  const modifiers = Object.entries(resolver.modifiers);
  if (modifiers.length !== 1)
    throw new Error("resolver: exactly one modifier (theme) is supported");
  const [, modifier] = modifiers[0];
  const contexts = Object.keys(modifier.contexts).sort((a, b) =>
    a === modifier.default ? -1 : b === modifier.default ? 1 : 0,
  );
  const trees: Record<string, Node> = {};
  const overrides: Record<string, Node> = {};
  for (const context of contexts) {
    const tree: Node = {};
    const own: Node = {};
    for (const step of resolver.resolutionOrder) {
      const [, kind, name] =
        step.$ref.match(/^#\/(sets|modifiers)\/(.+)$/) ?? [];
      if (kind === "sets") merge(tree, await load(resolver.sets[name].sources));
      else if (kind === "modifiers") {
        const loaded = await load(resolver.modifiers[name].contexts[context]);
        merge(tree, loaded);
        merge(own, loaded);
      } else throw new Error(`resolver: cannot follow ${step.$ref}`);
    }
    trees[context] = tree;
    overrides[context] = own;
  }
  return { contexts, trees, overrides };
}

// ---------------------------------------------------------------- flatten

const extOf = (node: Node): LacquerExtensions =>
  ((node.$extensions as Node | undefined)?.[EXT] as LacquerExtensions) ?? {};

interface Flat extends Omit<Token, "type"> {
  type?: TokenType;
  value: unknown;
}

/**
 * Every role in a tree with its value, walking groups, inheriting `$type`
 * and `$deprecated`, and treating a shorthand group as one role.
 */
export function flatten(tree: Node): Map<string, Flat> {
  const out = new Map<string, Flat>();
  const walk = (
    node: Node,
    p: string[],
    inherited: { type?: TokenType; deprecated?: boolean | string },
  ) => {
    const ext = extOf(node);
    const type = (node.$type as TokenType | undefined) ?? inherited.type;
    const deprecated =
      (node.$deprecated as boolean | string | undefined) ??
      inherited.deprecated;
    const role = p.join(".");
    const common = {
      role,
      path: p,
      description: node.$description as string | undefined,
      deprecated,
      ext,
    };
    if (ext.shorthand) {
      out.set(role, {
        ...common,
        type: "shorthand",
        value: {
          block: (node.block as Node | undefined)?.$value,
          inline: (node.inline as Node | undefined)?.$value,
        },
      });
      return;
    }
    if ("$value" in node) {
      out.set(role, { ...common, type, value: node.$value });
      return;
    }
    for (const [key, child] of Object.entries(node)) {
      if (key.startsWith("$")) continue;
      walk(child as Node, [...p, key], { type, deprecated });
    }
  };
  walk(tree, [], {});
  return out;
}

const ALIAS = /^\{([^}]+)\}$/;
export const aliasTarget = (v: unknown): string | null =>
  typeof v === "string" ? (v.match(ALIAS)?.[1] ?? null) : null;

// ---------------------------------------------------------------- read + validate

export interface TokenSet {
  /** Default context first. */
  contexts: string[];
  tokens: Map<string, Token>;
  /** role -> context -> raw $value. */
  values: Map<string, Record<string, unknown>>;
}

export async function readTokens(
  categories: Set<string>,
  file = RESOLVER_FILE,
): Promise<{ set: TokenSet; problems: string[] }> {
  const problems: string[] = [];
  const { contexts, trees, overrides } = await readTokenTrees(file);
  const [base, ...others] = contexts;
  const flat = new Map<string, Flat>();
  const values = new Map<string, Record<string, unknown>>();
  for (const [role, t] of flatten(trees[base])) {
    flat.set(role, t);
    values.set(role, { [base]: t.value });
  }
  for (const context of others)
    for (const [role, t] of flatten(overrides[context])) {
      if (!flat.has(role)) {
        problems.push(`${context}: ${role} has no value in ${base}`);
        continue;
      }
      (values.get(role) as Record<string, unknown>)[context] = t.value;
    }

  // A type is declared, inherited, or the alias target's.
  const typeOf = (
    role: string,
    seen = new Set<string>(),
  ): TokenType | undefined => {
    const t = flat.get(role);
    if (!t || seen.has(role)) return undefined;
    if (t.type) return t.type;
    seen.add(role);
    const target = aliasTarget(values.get(role)?.[base]);
    return target ? typeOf(target, seen) : undefined;
  };

  const tokens = new Map<string, Token>();
  for (const [role, t] of flat) {
    if (!categories.has(t.path[0]))
      problems.push(
        `${role}: category "${t.path[0]}" is not in vocab.token_categories`,
      );
    if (!/^[a-z][a-z0-9-]*(\.[a-z0-9-]+)+$/.test(role))
      problems.push(`${role}: role names are lowercase, dotted, dashed`);
    const type = typeOf(role);
    if (!type) {
      problems.push(`${role}: no $type, inherited or by alias`);
      continue;
    }
    if (type !== "shorthand" && !TYPES.has(type)) {
      problems.push(`${role}: unknown $type "${type}"`);
      continue;
    }
    tokens.set(role, { ...t, type });
    for (const [context, v] of Object.entries(values.get(role) ?? {})) {
      const target = aliasTarget(v);
      if (target && !flat.has(target))
        problems.push(
          `${role} (${context}): alias {${target}} resolves to nothing`,
        );
      else if (!target) {
        const shape = checkShape(type, v);
        if (shape) problems.push(`${role} (${context}): ${shape}`);
      }
    }
  }
  for (const role of tokens.keys()) {
    const seen = new Set<string>();
    let cur: string | null = role;
    while (cur && !seen.has(cur)) {
      seen.add(cur);
      cur = aliasTarget(values.get(cur)?.[base]);
    }
    if (cur) problems.push(`${role}: alias cycle through {${cur}}`);
  }
  return { set: { contexts, tokens, values }, problems };
}

const isDim = (v: unknown): v is Dimension =>
  isObject(v) &&
  typeof v.value === "number" &&
  ["px", "rem"].includes(v.unit as string);
const dimOrAlias = (v: unknown) => isDim(v) || aliasTarget(v) !== null;

/** A value's conformance to its type's shape; null when fine. */
function checkShape(type: TokenType, v: unknown): string | null {
  switch (type) {
    case "color": {
      const c = v as Color;
      if (
        !isObject(c) ||
        typeof c.colorSpace !== "string" ||
        !Array.isArray(c.components)
      )
        return "color needs { colorSpace, components[] }";
      if (c.hex !== undefined && !/^#[0-9a-f]{6}$/.test(c.hex))
        return "color.hex must be 6-digit lowercase hex";
      return null;
    }
    case "dimension":
      return isDim(v) ? null : "dimension needs { value, unit: px | rem }";
    case "duration": {
      const d = v as Duration;
      return isObject(d) &&
        typeof d.value === "number" &&
        ["ms", "s"].includes(d.unit)
        ? null
        : "duration needs { value, unit: ms | s }";
    }
    case "number":
      return typeof v === "number" ? null : "number must be a JSON number";
    case "fontFamily":
      return typeof v === "string" ||
        (Array.isArray(v) && v.every((s) => typeof s === "string"))
        ? null
        : "fontFamily is a string or string[]";
    case "fontWeight":
      return typeof v === "number" || typeof v === "string"
        ? null
        : "fontWeight is a number or keyword";
    case "cubicBezier":
      return Array.isArray(v) &&
        v.length === 4 &&
        v.every((n) => typeof n === "number")
        ? null
        : "cubicBezier is [x1, y1, x2, y2]";
    case "shadow": {
      for (const s of (Array.isArray(v) ? v : [v]) as Shadow[]) {
        if (!isObject(s)) return "shadow is an object or array of objects";
        for (const k of ["offsetX", "offsetY", "blur", "spread"] as const)
          if (!dimOrAlias(s[k])) return `shadow.${k} must be a dimension`;
        if (!s.color) return "shadow.color is required";
      }
      return null;
    }
    case "typography": {
      const t = v as Typography;
      if (!isObject(t)) return "typography is an object";
      if (!dimOrAlias(t.fontSize))
        return "typography.fontSize must be a dimension";
      if (
        t.fontWeight === undefined ||
        t.lineHeight === undefined ||
        t.fontFamily === undefined ||
        t.letterSpacing === undefined
      )
        return "typography needs fontFamily, fontSize, fontWeight, letterSpacing, lineHeight (DTCG 9.8)";
      if (!dimOrAlias(t.letterSpacing))
        return "typography.letterSpacing must be a dimension";
      // The html binding emits a typography role as the `font` shorthand,
      // which has no letter-spacing slot; a non-zero tracking would be lost.
      if (isDim(t.letterSpacing) && t.letterSpacing.value !== 0)
        return "typography.letterSpacing must be 0: the font shorthand cannot carry it (add a tracking role instead)";
      return null;
    }
    case "shorthand": {
      const s = v as Node;
      return isDim(s?.block) && isDim(s?.inline)
        ? null
        : "a padding shorthand group needs dimension children block and inline";
    }
  }
}

// ---------------------------------------------------------------- bindings

/** `color.bg.primary` -> `--lq-color-bg-primary`. */
export const htmlProperty = (role: string) =>
  `${LQ_PREFIX}${role.replace(/\./g, "-")}`;

/**
 * Tailwind 4 theme namespaces, by type and category, as the installed
 * Tailwind resolves them (`--color-*` -> bg-/text-/border-…, `--spacing-*`
 * -> p-/gap-/h-/size-…, `--z-index-*` -> z-, `--transition-duration-*` ->
 * duration-). null: no namespace fits; the role is read as a variable.
 */
function namespaceFor(t: Token): string | null {
  const [category, sub] = t.path;
  switch (t.type) {
    case "color":
      return "color";
    case "dimension":
      if (category === "radius") return "radius";
      if (category === "focus") return null;
      return "spacing";
    case "duration":
      return "transition-duration";
    case "cubicBezier":
      return "ease";
    case "fontFamily":
      return "font";
    case "shadow":
      return "shadow";
    case "number":
      if (category === "z") return "z-index";
      if (category === "opacity") return "opacity";
      if (sub === "measure") return "container";
      return null;
    default:
      return null;
  }
}

/**
 * The theme-variable suffix for a namespaced role. The category is dropped
 * when the namespace is its home (`color.bg.primary` -> `bg-primary`) and
 * kept when a role of that type sits elsewhere (`shimmer.highlight` ->
 * `shimmer-highlight`); a segment that only restates the namespace is
 * dropped too (`motion.duration.fast` -> `fast`, `type.family.sans` -> `sans`).
 */
const HOME: Record<string, string[]> = {
  color: ["color"],
  radius: ["radius"],
  spacing: ["space", "size"],
  container: ["size"],
  font: ["type"],
  shadow: ["shadow"],
  "z-index": ["z"],
  "transition-duration": ["motion"],
  ease: ["motion"],
  opacity: ["opacity"],
};
const RESTATES: Record<string, string[]> = {
  "transition-duration": ["duration"],
  ease: ["easing"],
  font: ["family"],
};
function suffixFor(t: Token, namespace: string): string {
  const [category, ...rest] = t.path;
  const kept = HOME[namespace]?.includes(category) ? rest : t.path;
  return kept
    .filter(
      (seg, i) => !(i < kept.length - 1 && RESTATES[namespace]?.includes(seg)),
    )
    .join("-");
}

/** The utility prefix for a namespaced role, from where it sits. */
function utilityFor(t: Token, namespace: string): string {
  const [category, sub] = t.path;
  switch (namespace) {
    case "color":
      if (sub === "fg" || sub === "status" || sub === "accent") return "text";
      return sub === "border" ? "border" : "bg";
    case "radius":
      return "rounded";
    case "spacing":
      if (category === "space") return sub === "gap" ? "gap" : "p";
      return sub === "icon" ? "size" : "h";
    case "container":
      return "max-w";
    case "z-index":
      return "z";
    case "transition-duration":
      return "duration";
    default:
      return namespace; // font, shadow, ease, opacity
  }
}

/** The CSS property a variable-form role sets, for its `[prop:var(…)]` class. */
function propertyFor(t: Token): string {
  if (t.ext.tailwind?.property) return t.ext.tailwind.property;
  if (t.type === "typography") return "font";
  if (t.type === "shorthand") return t.ext.shorthand ?? "padding";
  return t.path.at(-1) ?? "";
}

export function deriveBindings(set: TokenSet): {
  html: Binding;
  tailwind: Binding;
} {
  const html: Record<string, BindingRole> = {};
  const tailwind: Record<string, BindingRole> = {};
  for (const [role, t] of set.tokens) {
    const property = htmlProperty(role);
    const meta: Partial<BindingRole> = { type: t.type };
    if (t.description) meta.description = t.description;
    if (t.deprecated !== undefined) meta.deprecated = t.deprecated;
    html[role] = { var: property, ...meta };
    const override = t.ext.tailwind ?? {};
    const namespace =
      override.namespace !== undefined ? override.namespace : namespaceFor(t);
    let cls: string;
    let variable: string;
    if (namespace) {
      const suffix = suffixFor(t, namespace);
      variable = `--${namespace}-lq-${suffix}`;
      const base = `${utilityFor(t, namespace)}-lq-${suffix}`;
      cls = suffix.endsWith("-hover") ? `hover:${base}` : base;
    } else {
      variable = property;
      const prop = propertyFor(t);
      cls =
        prop === "padding" ? `p-(${property})` : `[${prop}:var(${property})]`;
    }
    tailwind[role] = { var: variable, class: override.class ?? cls, ...meta };
  }
  return {
    html: { id: "html", renderer: "html", version: 1, roles: html },
    tailwind: {
      id: "tailwind",
      renderer: "react",
      version: 1,
      extends: "html",
      roles: tailwind,
    },
  };
}

/**
 * Two roles that derive the same binding name: the later would silently
 * shadow the earlier in the stylesheet, so the build refuses it. A role
 * steers its names through `$extensions["dev.lacquer"].tailwind`.
 */
export function bindingCollisions(binding: Binding): string[] {
  const problems: string[] = [];
  for (const key of ["var", "class"] as const) {
    const seen = new Map<string, string>();
    for (const [role, bound] of Object.entries(binding.roles)) {
      const name = bound[key];
      if (!name) continue;
      const other = seen.get(name);
      if (other)
        problems.push(
          `${role} and ${other} both derive the ${binding.id} ${key} ${name}`,
        );
      seen.set(name, role);
    }
  }
  return problems;
}

/** The `@theme inline` aliases: theme variable -> `var(--lq-…)`, for roles bound to a namespace. */
export function themeAliases(
  html: Binding,
  tailwind: Binding,
): Record<string, string> {
  const aliases: Record<string, string> = {};
  for (const [role, bound] of Object.entries(tailwind.roles)) {
    const own = html.roles[role].var;
    if (bound.var !== own) aliases[bound.var] = `var(${own})`;
  }
  return aliases;
}

// ---------------------------------------------------------------- css values

const num = (n: number) => String(Math.round(n * 10000) / 10000);
const comp = (x: number | "none") => (x === "none" ? x : num(x));

function cssColor(c: Color): string {
  const alpha = c.alpha ?? 1;
  if (c.hex && alpha === 1) return c.hex;
  const a = alpha === 1 ? "" : ` / ${num(alpha)}`;
  if (c.colorSpace === "srgb")
    return `rgb(${c.components
      .map((x) => (x === "none" ? x : Math.round(x * 255)))
      .join(" ")}${a})`;
  const body = c.components.map(comp).join(" ");
  if (["hsl", "hwb", "lab", "lch", "oklab", "oklch"].includes(c.colorSpace))
    return `${c.colorSpace}(${body}${a})`;
  return `color(${c.colorSpace} ${body}${a})`;
}
const cssDim = (d: Dimension) => `${num(d.value)}${d.unit}`;
const cssDur = (d: Duration) => `${num(d.value)}${d.unit}`;
const cssFamily = (f: string | string[]) =>
  Array.isArray(f) ? f.join(", ") : f;

/** A sub-value that may be an alias, emitted as the html property reference. */
function part<T>(v: T | string, emit: (x: T) => string): string {
  const target = aliasTarget(v);
  return target ? `var(${htmlProperty(target)})` : emit(v as T);
}

/** The CSS text of a role's value in one context. */
export function cssValue(t: Token, value: unknown): string {
  const target = aliasTarget(value);
  if (target) return `var(${htmlProperty(target)})`;
  switch (t.type) {
    case "color":
      return cssColor(value as Color);
    case "dimension":
      return cssDim(value as Dimension);
    case "duration":
      return cssDur(value as Duration);
    case "number":
      return `${num(value as number)}${t.ext.unit ?? ""}`;
    case "fontFamily":
      return cssFamily(value as string | string[]);
    case "fontWeight":
      return String(value);
    case "cubicBezier":
      return `cubic-bezier(${(value as number[]).map(num).join(", ")})`;
    case "shadow":
      return ((Array.isArray(value) ? value : [value]) as Shadow[])
        .map((s) =>
          [
            s.inset ? "inset" : "",
            part(s.offsetX, cssDim),
            part(s.offsetY, cssDim),
            part(s.blur, cssDim),
            part(s.spread, cssDim),
            part(s.color, cssColor),
          ]
            .filter(Boolean)
            .join(" "),
        )
        .join(", ");
    case "typography": {
      const ty = value as Typography;
      return `${part(ty.fontWeight, String)} ${part(ty.fontSize, cssDim)}/${part(ty.lineHeight, num)} ${part(ty.fontFamily, cssFamily)}`;
    }
    case "shorthand": {
      const s = value as { block: Dimension; inline: Dimension };
      return `${cssDim(s.block)} ${cssDim(s.inline)}`;
    }
  }
}

/** Every role's CSS value per context, keyed by html property. */
export function theme(set: TokenSet): Theme {
  const out: Theme = { light: {}, dark: {} };
  for (const [role, t] of set.tokens) {
    const property = htmlProperty(role);
    for (const [context, v] of Object.entries(set.values.get(role) ?? {})) {
      const mode = context as keyof Theme;
      out[mode] ??= {};
      out[mode][property] = cssValue(t, v);
    }
  }
  return out;
}

// ---------------------------------------------------------------- stylesheets

const declarations = (vars: Record<string, string>, indent = "  ") =>
  Object.entries(vars)
    .map(([property, value]) => `${indent}${property}: ${value};`)
    .join("\n");

const GENERATED = [
  "/*",
  " * GENERATED by packages/core/scripts/build-spec.ts from spec/tokens/.",
  " * Do not edit; change the tokens and run `pnpm build`.",
  " *",
];

/** The html binding's reference theme: light on :root, dark under the system preference. */
export function renderHtmlTheme(t: Theme): string {
  return [
    ...GENERATED,
    " * The html binding's reference theme: a value for every `--lq-*` property",
    " * so the catalog's HTML examples render on their own. A consumer overrides",
    " * any property on :root (or on a scope) and every example follows.",
    " */",
    ":root {",
    declarations(t.light),
    "}",
    "",
    "@media (prefers-color-scheme: dark) {",
    "  :root {",
    declarations(t.dark, "    "),
    "  }",
    "}",
    "",
  ].join("\n");
}

/** The tailwind binding's stylesheet: aliases, then the values, dark on `.dark`. */
export function renderTailwindTheme(
  html: Binding,
  tailwind: Binding,
  t: Theme,
): string {
  return [
    ...GENERATED,
    " * The Tailwind binding's stylesheet. `@theme inline` aliases every",
    " * Tailwind theme variable to the html binding's `--lq-*` property, so",
    " * `bg-lq-bg-primary` reads `var(--lq-color-bg-primary)` and retheming",
    " * the `--lq-*` properties rethemes both bindings. The values below are",
    " * the reference theme; dark mode is the `dark` class on an ancestor.",
    " */",
    "@theme inline {",
    declarations(themeAliases(html, tailwind)),
    "}",
    "",
    ":root {",
    declarations(t.light),
    "}",
    "",
    ".dark {",
    declarations(t.dark),
    "}",
    "",
  ].join("\n");
}
