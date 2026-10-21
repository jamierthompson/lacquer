/**
 * LQ-TOKEN-01, static. Component styles read token roles only, through the
 * binding: in CSS, `var(--lq-…)`; in Tailwind, the `lq-` utilities or the
 * `(--lq-…)` variable form. A literal colour, radius, shadow, duration or
 * z-index, a palette or default-scale utility, or a property outside the
 * binding is a finding.
 *
 * Two scanners, one rule: `scanCss` for stylesheets, `scanClasses` for the
 * string literals in TS/TSX. `checkTokens` walks the roots and skips the
 * anti-examples, which are meant to fail and are tested as fixtures.
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { componentOf, type Finding } from "../finding.ts";

export const RULE = "LQ-TOKEN-01";
const DIMENSION = "tokens";
const FIX =
  "Replace with the role's --lq-* property or its lq- utility (dist/bindings.json, derived from spec/tokens); values belong in a theme.";

/** Custom properties the binding defines, with the leading `--`. */
export type KnownProperties = ReadonlySet<string>;

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
const DURATION = /(^|[\s,(])\d*\.?\d+m?s\b/;
const INTEGER = /(^|[\s,(])\d+(?=$|[\s,)])/;

const isColorProperty = (p: string) =>
  /^(color|background|background-color|border(-(top|right|bottom|left|block|inline)(-(start|end))?)?(-color)?|outline|outline-color|fill|stroke|text-decoration-color|caret-color|accent-color|column-rule(-color)?)$/.test(
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
  known: KnownProperties,
  component: string,
): string | null {
  if (!name.startsWith("--lq-")) return `${name} is outside the binding`;
  if (known.has(name) || name.startsWith(`--lq-${component}-`)) return null;
  return `${name} binds no role`;
}

/** What is literal in a value for a property of this kind; empty when clean. */
export function literalsIn(
  property: string,
  value: string,
  known: KnownProperties,
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
    custom ||
    isColorProperty(property) ||
    isShadowProperty(property) ||
    /^(border|outline|background|text-decoration|column-rule)$/.test(property);
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

export function scanCss(
  source: string,
  file: string,
  known: KnownProperties,
): Finding[] {
  const css = blankComments(source);
  const findings: Finding[] = [];
  const component = componentOf(file);
  let depth = 0;
  let start = 0;
  const declaration = (end: number) => {
    const text = css.slice(start, end);
    const colon = text.indexOf(":");
    if (depth === 0 || colon < 0) return;
    const property = text.slice(0, colon).trim().toLowerCase();
    const value = text
      .slice(colon + 1)
      .replace(/\s+/g, " ")
      .trim();
    if (!/^(--)?[a-z-]+$/.test(property)) return;
    const literals = literalsIn(property, value, known, component);
    if (!literals.length) return;
    const line = lineAt(css, start + text.search(/\S/));
    findings.push({
      rule: RULE,
      level: "MUST",
      dimension: DIMENSION,
      component,
      message: `\`${property}\` is set to a literal instead of a token role through the binding.`,
      location: { file, line, snippet: `${property}: ${value}` },
      evidence: literals.join(", "),
      fix: FIX,
    });
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

// ---------------------------------------------------------------- classes

const PALETTE =
  "red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|zinc|neutral|stone|taupe|olive|mist|mauve|white|black";
/** shadcn's semantic names: not roles, and absent from a project on the Lacquer base. */
const SEMANTIC =
  "background|foreground|card|popover|primary|secondary|muted|accent|destructive|border|input|ring|sidebar(-[a-z-]+)?|chart-\\d";
const COLOR_UTILITY =
  "bg|text|border(-[trblxyse]|-[a-z]+)?|ring|ring-offset|inset-ring|outline|fill|stroke|from|via|to|shadow|inset-shadow|decoration|accent|caret|divide|placeholder";

const PALETTE_CLASS = new RegExp(
  `^(${COLOR_UTILITY})-(${PALETTE})(-\\d{2,3})?(/\\d+)?$`,
);
const SEMANTIC_CLASS = new RegExp(
  `^(${COLOR_UTILITY})-(${SEMANTIC})(-foreground)?(/\\d+)?$`,
);
const RADIUS_CLASS =
  /^rounded(-(t|r|b|l|s|e|tl|tr|br|bl|ss|se|es|ee))?-(xs|sm|md|lg|xl|[2-4]xl|full)$/;
const SHADOW_CLASS =
  /^(shadow|inset-shadow|drop-shadow|text-shadow)-(2xs|xs|sm|md|lg|xl|2xl)$/;
const DURATION_CLASS = /^(duration|delay)-\d+$/;
const Z_CLASS = /^z-\d+$/;
const ARBITRARY_VALUE = new RegExp(
  `^(${COLOR_UTILITY}|rounded(-[a-z]+)?|z|duration|delay)-\\[(.+)\\]$`,
);
const ARBITRARY_PROPERTY = /^\[([a-z-]+):(.+)\]$/;
const VARIABLE_FORM = /^[a-z-]+-\((?:[a-z-]+:)?(--[a-z0-9_-]+)\)$/;
/** Variants and modifiers in front of the utility: `hover:`, `data-[state=open]:`, `!`, `-`. */
const VARIANTS = /^(?:[a-z0-9-]+(?:\[[^\]]*\]|\([^)]*\))?:)+/;

/** Why a class token violates the rule, or null when it is fine. */
export function classViolation(
  token: string,
  known: KnownProperties,
  component = "screen",
): string | null {
  const utility = token.replace(VARIANTS, "").replace(/^[!-]+/, "");
  const variable = utility.match(VARIABLE_FORM);
  if (variable) return variableViolation(variable[1], known, component);
  const property = utility.match(ARBITRARY_PROPERTY);
  if (property) {
    const literals = literalsIn(property[1], property[2], known, component);
    return literals.length ? literals.join(", ") : null;
  }
  // A theme utility from the Tailwind binding: bg-lq-bg-primary, rounded-lq-control…
  if (/-lq-[a-z0-9-]+(\/\d+)?$/.test(utility)) return null;
  const arbitrary = utility.match(ARBITRARY_VALUE);
  if (arbitrary) {
    const inner = arbitrary.at(-1) ?? "";
    if (/^var\(--lq-/.test(inner)) return null;
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
  known: KnownProperties,
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
const CODE = /\.(tsx|ts|jsx|js|mjs)$/;
const SKIP =
  /(^|\/)(node_modules|dist|\.next|examples\/anti)(\/|$)|\.d\.ts$|\.test\.tsx?$/;

export async function* sourceFiles(root: string): AsyncGenerator<string> {
  for (const entry of await readdir(root, { withFileTypes: true })) {
    const full = path.join(root, entry.name);
    if (SKIP.test(full)) continue;
    if (entry.isDirectory()) yield* sourceFiles(full);
    else if (CSS.test(entry.name) || CODE.test(entry.name)) yield full;
  }
}

export async function checkTokens(
  roots: string[],
  known: KnownProperties,
  relativeTo = process.cwd(),
): Promise<Finding[]> {
  const findings: Finding[] = [];
  for (const root of roots) {
    for await (const file of sourceFiles(root)) {
      const source = await readFile(file, "utf8");
      const rel = path.relative(relativeTo, file);
      findings.push(
        ...(CSS.test(file)
          ? scanCss(source, rel, known)
          : scanClasses(source, rel, known)),
      );
    }
  }
  return findings;
}
