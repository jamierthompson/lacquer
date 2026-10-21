/**
 * LQ-TOKEN-01, static. Component styles read token roles only, through the
 * binding: in CSS, `var(--lq-…)`; in Tailwind, the `lq-` utilities or the
 * `(--lq-…)` variable form. A literal colour, radius, shadow, duration or
 * z-index, a palette or default-scale utility, or a property outside the
 * binding is a finding.
 *
 * Three scanners, one rule: `scanCss` for stylesheets, `scanHtml` for an
 * example's `<style>` blocks and `style=""` attributes, `scanClasses` for the
 * string literals in TS/TSX. `checkTokens` walks the roots and skips the
 * anti-examples, which are meant to fail and are tested as fixtures.
 */
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import type { Bindings } from "@lacquer/core";
import { componentOf, type Finding } from "../finding.ts";

export const RULE = "LQ-TOKEN-01";
const DIMENSION = "tokens";
const FIX =
  "Replace with the role's --lq-* property or its lq- utility (dist/bindings.json, derived from spec/tokens); values belong in a theme.";

/**
 * What the binding defines: the html custom properties, with the leading
 * `--`, and the Tailwind theme variables by namespace (`color` ->
 * {`lq-bg-primary`, …}), so a class can be checked for the role it names.
 */
export interface Known {
  properties: ReadonlySet<string>;
  theme: ReadonlyMap<string, ReadonlySet<string>>;
}

/** The `Known` set for the compiled bindings. */
export function knownFrom(bindings: Bindings): Known {
  const properties = new Set(
    Object.values(bindings.html.roles).map((r) => r.var),
  );
  const theme = new Map<string, Set<string>>();
  for (const role of Object.values(bindings.tailwind.roles)) {
    const m = role.var.match(/^--([a-z-]+?)-(lq-[a-z0-9-]+)$/);
    if (!m) continue;
    const set = theme.get(m[1]) ?? new Set<string>();
    set.add(m[2]);
    theme.set(m[1], set);
  }
  return { properties, theme };
}

// ---------------------------------------------------------------- values

const NAMED_COLORS = new Set(
  `aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond blue blueviolet brown burlywood cadetblue chartreuse chocolate coral cornflowerblue cornsilk crimson cyan darkblue darkcyan darkgoldenrod darkgray darkgreen darkgrey darkkhaki darkmagenta darkolivegreen darkorange darkorchid darkred darksalmon darkseagreen darkslateblue darkslategray darkslategrey darkturquoise darkviolet deeppink deepskyblue dimgray dimgrey dodgerblue firebrick floralwhite forestgreen fuchsia gainsboro ghostwhite gold goldenrod gray green greenyellow grey honeydew hotpink indianred indigo ivory khaki lavender lavenderblush lawngreen lemonchiffon lightblue lightcoral lightcyan lightgoldenrodyellow lightgray lightgreen lightgrey lightpink lightsalmon lightseagreen lightskyblue lightslategray lightslategrey lightsteelblue lightyellow lime limegreen linen magenta maroon mediumaquamarine mediumblue mediumorchid mediumpurple mediumseagreen mediumslateblue mediumspringgreen mediumturquoise mediumvioletred midnightblue mintcream mistyrose moccasin navajowhite navy oldlace olive olivedrab orange orangered orchid palegoldenrod palegreen paleturquoise palevioletred papayawhip peachpuff peru pink plum powderblue purple rebeccapurple red rosybrown royalblue saddlebrown salmon sandybrown seagreen seashell sienna silver skyblue slateblue slategray slategrey snow springgreen steelblue tan teal thistle tomato turquoise violet wheat white whitesmoke yellow yellowgreen`.split(
    /\s+/,
  ),
);

const COLOR_FUNCTION =
  /\b(rgba?|hsla?|hwb|lab|lch|oklab|oklch|color|color-mix|light-dark)\(/i;
const HEX = /#[0-9a-f]{3,8}\b/i;
const LENGTH = /(^|[\s,(])-?\d*\.?\d+(px|r?em|%|vw|vh|ch|ex|cm|mm|in|pt|pc)\b/;
const DURATION = /(^|[\s,(])-?\d*\.?\d+m?s\b/;
const INTEGER = /(^|[\s,(])-?\d+(?=$|[\s,)])/;

/** Properties that take a colour, including the shorthands and images that carry one. */
const isColorProperty = (p: string) =>
  /^(color|background(-color|-image)?|border(-(top|right|bottom|left|block|inline)(-(start|end))?)?(-color)?|border-image(-source)?|outline(-color)?|fill|stroke|stop-color|flood-color|lighting-color|text-decoration(-color)?|text-emphasis(-color)?|caret-color|accent-color|column-rule(-color)?|scrollbar-color|-webkit-text-fill-color|-webkit-text-stroke(-color)?)$/.test(
    p,
  );
const isRadiusProperty = (p: string) => /^border(-[a-z-]+)?-radius$/.test(p);
const isShadowProperty = (p: string) => /^(box|text)-shadow$/.test(p);
const isDurationProperty = (p: string) =>
  /^(transition|animation)(-(duration|delay))?$/.test(p);
const isZProperty = (p: string) => p === "z-index";

/** `var(--lq-…)` references, removed from a value before looking for literals. */
const BINDING_VAR = /var\(\s*(--lq-[a-z0-9-]+)\s*(,[^)]*)?\)/g;
const ANY_VAR = /var\(\s*(--[a-z0-9_-]+)/gi;

/**
 * Why a `var()` reference is not a role, or null. A binding property passes;
 * so does a property scoped to the component itself (`--lq-<id>-…`), which
 * is how a spec exposes a parameter such as textarea's max rows.
 */
export function variableViolation(
  name: string,
  known: Known,
  component: string,
): string | null {
  if (!name.startsWith("--lq-")) return `${name} is outside the binding`;
  if (known.properties.has(name) || name.startsWith(`--lq-${component}-`))
    return null;
  return `${name} binds no role`;
}

/** What is literal in a value for a property of this kind; empty when clean. */
export function literalsIn(
  property: string,
  value: string,
  known: Known,
  component = "screen",
): string[] {
  const found: string[] = [];
  for (const m of value.matchAll(ANY_VAR)) {
    const why = variableViolation(m[1], known, component);
    if (why) found.push(why.replace(/^(--\S+)/, "var($1)"));
  }
  const rest = value.replace(BINDING_VAR, " ").replace(/url\([^)]*\)/g, " ");
  const custom = property.startsWith("--");
  const colour =
    custom || isColorProperty(property) || isShadowProperty(property);
  if (colour) {
    const hex = rest.match(HEX);
    if (hex) found.push(hex[0]);
    const fn = rest.match(COLOR_FUNCTION);
    if (fn) found.push(`${fn[1]}(…)`);
    for (const word of rest.toLowerCase().match(/[a-z]+/g) ?? [])
      if (NAMED_COLORS.has(word)) found.push(word);
  }
  if (isRadiusProperty(property) || isShadowProperty(property)) {
    const length = rest.match(LENGTH);
    if (length) found.push(length[0].trim());
  }
  if (custom || isDurationProperty(property)) {
    const duration = rest.match(DURATION);
    if (duration && !/^\s*0m?s$/.test(duration[0]))
      found.push(duration[0].trim());
  }
  if (isZProperty(property) || custom) {
    const integer = rest.match(INTEGER);
    if (isZProperty(property) && integer && integer[0].trim() !== "0")
      found.push(integer[0].trim());
  }
  return [...new Set(found)];
}

// ---------------------------------------------------------------- css

const lineAt = (text: string, offset: number) =>
  text.slice(0, offset).split("\n").length;

/** Comments become spaces so offsets, and therefore line numbers, hold. */
const blankComments = (css: string) =>
  css.replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, " "));

/** The finding for one `property: value` declaration, or null when it is clean. */
function declarationFinding(
  text: string,
  file: string,
  line: number,
  known: Known,
  component: string,
): Finding | null {
  const colon = text.indexOf(":");
  if (colon < 0) return null;
  const property = text.slice(0, colon).trim().toLowerCase();
  const value = text
    .slice(colon + 1)
    .replace(/\s+/g, " ")
    .trim();
  if (!/^(--)?-?[a-z-]+$/.test(property)) return null;
  const literals = literalsIn(property, value, known, component);
  if (!literals.length) return null;
  return {
    rule: RULE,
    level: "MUST",
    dimension: DIMENSION,
    component,
    message: `\`${property}\` is set to a literal instead of a token role through the binding.`,
    location: { file, line, snippet: `${property}: ${value}` },
    evidence: literals.join(", "),
    fix: FIX,
  };
}

export function scanCss(source: string, file: string, known: Known): Finding[] {
  const css = blankComments(source);
  const findings: Finding[] = [];
  const component = componentOf(file);
  let depth = 0;
  let start = 0;
  const declaration = (end: number) => {
    if (depth === 0) return;
    const text = css.slice(start, end);
    const line = lineAt(css, start + Math.max(0, text.search(/\S/)));
    const f = declarationFinding(text, file, line, known, component);
    if (f) findings.push(f);
  };
  for (let i = 0; i < css.length; i++) {
    const c = css[i];
    if (c === "{") {
      depth++;
      start = i + 1;
    } else if (c === ";") {
      declaration(i);
      start = i + 1;
    } else if (c === "}") {
      declaration(i);
      depth = Math.max(0, depth - 1);
      start = i + 1;
    }
  }
  return findings;
}

/** `style="…"` attributes: declarations at depth 0, which `scanCss` ignores. */
const STYLE_ATTRIBUTE = /\sstyle\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;

/**
 * An HTML example: its `<style>` blocks (plain CSS, so `scanCss` reads them
 * where the markup around them is at depth 0) and its inline styles.
 */
export function scanHtml(
  source: string,
  file: string,
  known: Known,
): Finding[] {
  const findings = scanCss(source, file, known);
  const component = componentOf(file);
  for (const m of source.matchAll(STYLE_ATTRIBUTE)) {
    const line = lineAt(source, m.index ?? 0);
    for (const text of (m[1] ?? m[2] ?? "").split(";")) {
      const f = declarationFinding(text, file, line, known, component);
      if (f) findings.push(f);
    }
  }
  return findings;
}

// ---------------------------------------------------------------- classes

const PALETTE =
  "red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|zinc|neutral|stone|taupe|olive|mist|mauve|white|black";
/** shadcn's semantic names: not roles, and absent from a project on the Lacquer base. */
const SEMANTIC =
  "background|foreground|card|popover|primary|secondary|muted|accent|destructive|border|input|ring|sidebar(-[a-z-]+)?|chart-\\d";
const COLOR_UTILITY =
  "bg|text|border(-[trblxyse]|-[a-z]+)?|ring|ring-offset|inset-ring|outline|fill|stroke|from|via|to|shadow|inset-shadow|decoration|accent|caret|divide|placeholder";

/** An opacity modifier: `/50`, `/[0.5]`, `/(--x)`. */
const OPACITY = "(/\\S+)?";
const PALETTE_CLASS = new RegExp(
  `^(${COLOR_UTILITY})-(${PALETTE})(-\\d{2,3})?${OPACITY}$`,
);
const SEMANTIC_CLASS = new RegExp(
  `^(${COLOR_UTILITY})-(${SEMANTIC})(-foreground)?${OPACITY}$`,
);
/** The default radius scale, including the bare `rounded` (Tailwind's `rounded-sm`-sized default). */
const RADIUS_CLASS =
  /^rounded(-(t|r|b|l|s|e|tl|tr|br|bl|ss|se|es|ee))?(-(xs|sm|md|lg|xl|[2-4]xl|full))?$/;
/** The default shadow scale, including the bare `shadow` and friends. */
const SHADOW_CLASS =
  /^(shadow|inset-shadow|drop-shadow|text-shadow)(-(2xs|xs|sm|md|lg|xl|2xl))?$/;
const DURATION_CLASS = /^(duration|delay)-\d+$/;
const Z_CLASS = /^z-\d+$/;
const ARBITRARY_VALUE = new RegExp(
  `^(${COLOR_UTILITY}|rounded(-[a-z]+)?|z|duration|delay)-\\[(.+)\\]$`,
);
const ARBITRARY_PROPERTY = /^\[(-?[a-z-]+):(.+)\]$/;
const VARIABLE_FORM = /^[a-z-]+-\((?:[a-z-]+:)?(--[a-z0-9_-]+)\)$/;
/**
 * Variants in front of the utility, each ending in `:`: `hover:`,
 * `data-[state=open]:`, `supports-(--x):`, `[&>svg]:`, `*:`, `**:`, `@md:`.
 */
const VARIANTS =
  /^(?:(?:\*{1,2}|@?[a-z0-9-]+(?:\[[^\]]*\]|\([^)]*\))?|\[[^\]]*\]):)+/;
/** `!` in either of Tailwind's positions and the negative `-` prefix. */
const MODIFIERS = { lead: /^[!-]+/, trail: /!$/ };

/** A theme utility from the Tailwind binding: `bg-lq-bg-primary`, `rounded-lq-control`… */
const THEME_UTILITY = new RegExp(`^([a-z-]+?)-(lq-[a-z0-9-]+?)${OPACITY}$`);
/**
 * The theme namespace a utility prefix reads, as the installed Tailwind
 * resolves it. Unlisted prefixes (`gap`, `h`, `size`, `max-w`…) read sizes,
 * which may be `spacing` or `container`.
 */
function namespacesOf(prefix: string): string[] {
  if (new RegExp(`^(${COLOR_UTILITY})$`).test(prefix)) return ["color"];
  if (/^rounded(-[a-z]+)?$/.test(prefix)) return ["radius"];
  if (/^(inset-)?shadow$/.test(prefix)) return ["shadow"];
  if (prefix === "z") return ["z-index"];
  if (/^(duration|delay)$/.test(prefix)) return ["transition-duration"];
  if (prefix === "ease") return ["ease"];
  if (prefix === "font") return ["font"];
  if (prefix === "opacity") return ["opacity"];
  return ["spacing", "container"];
}

/** Why a class token violates the rule, or null when it is fine. */
export function classViolation(
  token: string,
  known: Known,
  component = "screen",
): string | null {
  const utility = token
    .replace(VARIANTS, "")
    .replace(MODIFIERS.lead, "")
    .replace(MODIFIERS.trail, "");
  const variable = utility.match(VARIABLE_FORM);
  if (variable) return variableViolation(variable[1], known, component);
  const property = utility.match(ARBITRARY_PROPERTY);
  if (property) {
    const literals = literalsIn(property[1], property[2], known, component);
    return literals.length ? literals.join(", ") : null;
  }
  const themed = utility.match(THEME_UTILITY);
  if (themed) {
    // `shadow-lq-sm` is the shadow namespace; `shadow-lq-bg-primary` would be a colour.
    const [, prefix, suffix] = themed;
    const namespaces =
      prefix === "shadow" || prefix === "inset-shadow"
        ? ["shadow", "color"]
        : namespacesOf(prefix);
    if (namespaces.some((ns) => known.theme.get(ns)?.has(suffix))) return null;
    return `${suffix} binds no role in ${namespaces.join(" or ")}`;
  }
  const arbitrary = utility.match(ARBITRARY_VALUE);
  if (arbitrary) {
    // A type hint (`bg-[color:var(--lq-…)]`) is Tailwind's, not a literal.
    const inner = (arbitrary.at(-1) ?? "").replace(/^[a-z-]+:/, "");
    const ref = inner.match(/^var\((--[a-z0-9_-]+)\)$/);
    if (ref) return variableViolation(ref[1], known, component);
    return `arbitrary value ${inner}`;
  }
  if (PALETTE_CLASS.test(utility)) return "palette colour";
  if (SEMANTIC_CLASS.test(utility))
    return "shadcn semantic colour, not a Lacquer role";
  if (RADIUS_CLASS.test(utility)) return "default radius scale";
  if (SHADOW_CLASS.test(utility)) return "default shadow scale";
  if (DURATION_CLASS.test(utility)) return "literal duration";
  if (Z_CLASS.test(utility)) return "literal z-index";
  return null;
}

const STRING_LITERAL =
  /"((?:[^"\\\n]|\\.)*)"|'((?:[^'\\\n]|\\.)*)'|`((?:[^`\\]|\\.)*)`/g;

export function scanClasses(
  source: string,
  file: string,
  known: Known,
): Finding[] {
  const findings: Finding[] = [];
  const component = componentOf(file);
  for (const m of source.matchAll(STRING_LITERAL)) {
    const text = m[1] ?? m[2] ?? m[3] ?? "";
    // Template literals: drop the expressions, keep the static class text.
    const classes = text.replace(/\$\{[^}]*\}/g, " ");
    for (const token of classes.split(/\s+/)) {
      if (!token) continue;
      const why = classViolation(token, known, component);
      if (!why) continue;
      findings.push({
        rule: RULE,
        level: "MUST",
        dimension: DIMENSION,
        component,
        message: `\`${token}\` styles with a literal instead of a token role through the binding.`,
        location: {
          file,
          line: lineAt(source, m.index ?? 0),
          snippet: token,
        },
        evidence: why,
        fix: FIX,
      });
    }
  }
  return findings;
}

// ---------------------------------------------------------------- walk

const CSS = /\.css$/;
const HTML = /\.html?$/;
const CODE = /\.(tsx|ts|jsx|js|mjs)$/;
const SKIP =
  /(^|\/)(node_modules|dist|\.next|examples\/anti)(\/|$)|\.d\.ts$|\.test\.tsx?$/;
const scannable = (name: string) =>
  CSS.test(name) || HTML.test(name) || CODE.test(name);

/** Every scannable file under a folder, or the file itself when given one. */
export async function* sourceFiles(root: string): AsyncGenerator<string> {
  if ((await stat(root)).isFile()) {
    if (scannable(root)) yield root;
    return;
  }
  for (const entry of await readdir(root, { withFileTypes: true })) {
    const full = path.join(root, entry.name);
    if (SKIP.test(full)) continue;
    if (entry.isDirectory()) yield* sourceFiles(full);
    else if (scannable(entry.name)) yield full;
  }
}

/** The scanner for a file, by its extension. */
export function scanFile(
  source: string,
  file: string,
  known: Known,
): Finding[] {
  if (CSS.test(file)) return scanCss(source, file, known);
  if (HTML.test(file)) return scanHtml(source, file, known);
  return scanClasses(source, file, known);
}

export async function checkTokens(
  roots: string[],
  known: Known,
  relativeTo = process.cwd(),
): Promise<Finding[]> {
  const findings: Finding[] = [];
  for (const root of roots) {
    for await (const file of sourceFiles(root)) {
      const source = await readFile(file, "utf8");
      findings.push(
        ...scanFile(source, path.relative(relativeTo, file), known),
      );
    }
  }
  return findings;
}
