import { readFile } from "node:fs/promises";
import path from "node:path";
import { loadBindings } from "@lacquer/core";
import { describe, expect, it } from "vitest";

import {
  checkTokens,
  classViolation,
  knownFrom,
  literalsIn,
  scanClasses,
  scanCss,
  scanHtml,
  sourceFiles,
} from "../src/checks/tokens.ts";

const REPO = path.resolve(import.meta.dirname, "../../..");
const CATALOG = "packages/core/spec/catalog";
const known = knownFrom(await loadBindings());

describe("literalsIn", () => {
  it("accepts binding properties and keywords", () => {
    expect(
      literalsIn("background-color", "var(--lq-color-bg-primary)", known),
    ).toEqual([]);
    expect(literalsIn("border", "1px solid transparent", known)).toEqual([]);
    expect(literalsIn("color", "currentColor", known)).toEqual([]);
    expect(literalsIn("box-shadow", "none", known)).toEqual([]);
    expect(literalsIn("transition", "none", known)).toEqual([]);
    expect(literalsIn("z-index", "0", known)).toEqual([]);
    expect(
      literalsIn(
        "outline",
        "var(--lq-focus-ring-width) solid var(--lq-color-border-focus)",
        known,
      ),
    ).toEqual([]);
  });

  it("flags literal colours, radii, shadows, durations and z-indexes", () => {
    expect(literalsIn("background", "#7c3aed", known)).toEqual(["#7c3aed"]);
    expect(literalsIn("color", "oklch(0.2 0 0)", known)).toEqual(["oklch(…)"]);
    expect(literalsIn("border-color", "white", known)).toEqual(["white"]);
    expect(literalsIn("border-radius", "12px", known)).toEqual(["12px"]);
    expect(
      literalsIn("box-shadow", "0 10px 15px -3px rgb(139 92 246 / 0.4)", known),
    ).toEqual(["rgb(…)", "10px"]);
    expect(
      literalsIn("transition", "background-color 300ms ease", known),
    ).toEqual(["300ms"]);
    expect(literalsIn("animation", "spin 1s linear infinite", known)).toEqual([
      "1s",
    ]);
    expect(literalsIn("z-index", "50", known)).toEqual(["50"]);
  });

  it("flags colours in images, vendor and SVG properties, and negative durations", () => {
    expect(
      literalsIn("background-image", "linear-gradient(#fff, #000)", known),
    ).toEqual(["#fff"]);
    expect(literalsIn("-webkit-text-fill-color", "#fff", known)).toEqual([
      "#fff",
    ]);
    expect(literalsIn("scrollbar-color", "#888 #fff", known)).toEqual(["#888"]);
    expect(literalsIn("stop-color", "red", known)).toEqual(["red"]);
    expect(literalsIn("animation-delay", "-1s", known)).toEqual(["-1s"]);
    expect(literalsIn("z-index", "-1", known)).toEqual(["-1"]);
  });

  it("flags properties outside the binding and unknown roles", () => {
    expect(literalsIn("color", "var(--foreground)", known)).toEqual([
      "var(--foreground) is outside the binding",
    ]);
    expect(literalsIn("color", "var(--lq-colour-fg-default)", known)).toEqual([
      "var(--lq-colour-fg-default) binds no role",
    ]);
  });

  it("accepts a property scoped to the component itself", () => {
    const value = "calc(var(--lq-textarea-max-rows, 8) * 1lh)";
    expect(literalsIn("max-block-size", value, known, "textarea")).toEqual([]);
    expect(literalsIn("max-block-size", value, known, "button")).toEqual([
      "var(--lq-textarea-max-rows) binds no role",
    ]);
  });
});

describe("classViolation", () => {
  it("accepts the Tailwind binding's forms", () => {
    for (const c of [
      "bg-lq-bg-primary",
      "hover:bg-lq-bg-primary-hover",
      "data-[state=open]:text-lq-fg-muted",
      "rounded-lq-control",
      "shadow-lq-sm",
      "z-lq-modal",
      "duration-lq-fast",
      "p-(--lq-space-inset-control-md)",
      "outline-(length:--lq-focus-ring-width)",
      "[font:var(--lq-type-label-md)]",
      "bg-[color:var(--lq-color-bg-primary)]",
      "text-lq-bg-primary",
      "ring-lq-border-focus/50",
      "gap-lq-gap-sm",
      "size-lq-icon-md",
      "max-w-lq-measure-prose",
      "via-lq-shimmer-highlight",
      "inline-flex",
      "items-center",
      "bg-transparent",
      "text-current",
      "rounded-none",
      "shadow-none",
      "z-auto",
    ])
      expect(classViolation(c, known), c).toBeNull();
  });

  it("flags palette, semantic, default-scale and arbitrary literals", () => {
    for (const c of [
      "bg-zinc-900",
      "text-white",
      "border-red-500/50",
      "bg-primary",
      "text-muted-foreground",
      "rounded-lg",
      "rounded-t-2xl",
      "shadow-md",
      "duration-200",
      "z-50",
      "bg-[#7c3aed]",
      "text-[oklch(0.2_0_0)]",
      "rounded-[12px]",
      "z-[60]",
      "[color:#fff]",
      "bg-(--background)",
      "bg-(--lq-colour-bg-primary)",
      "bg-zinc-900!",
      "*:bg-zinc-900",
      "**:text-white",
      "[&>svg]:bg-red-500",
      "@md:bg-zinc-900",
      "rounded",
      "rounded-t",
      "shadow",
      "drop-shadow",
      "bg-zinc-900/[0.5]",
      "z-[var(--lq-nope)]",
    ])
      expect(classViolation(c, known), c).not.toBeNull();
  });

  it("checks an lq- utility against the binding, in its namespace", () => {
    expect(classViolation("bg-lq-made-up-role", known)).toBe(
      "lq-made-up-role binds no role in color",
    );
    expect(classViolation("rounded-lq-bg-primary", known)).toBe(
      "lq-bg-primary binds no role in radius",
    );
    expect(classViolation("rounded-lq-nope", known)).toBe(
      "lq-nope binds no role in radius",
    );
  });
});

describe("the catalog's fixtures", () => {
  it("passes the button reference stylesheet", async () => {
    const file = `${CATALOG}/core/actions/button/examples/html/button.css`;
    const css = await readFile(path.join(REPO, file), "utf8");
    expect(scanCss(css, file, known)).toEqual([]);
  });

  it("fails the anti-example that cites LQ-TOKEN-01", async () => {
    const file = `${CATALOG}/core/actions/button/examples/anti/literal-purple-no-focus.html`;
    const html = await readFile(path.join(REPO, file), "utf8");
    const findings = scanCss(html, file, known);
    expect(findings.map((f) => f.evidence)).toEqual(
      expect.arrayContaining([expect.stringContaining("#7c3aed"), "12px"]),
    );
    expect(findings[0]).toMatchObject({
      rule: "LQ-TOKEN-01",
      level: "MUST",
      dimension: "tokens",
      component: "button",
    });
  });

  it("passes every reference stylesheet and HTML example in the catalog", async () => {
    const findings = await checkTokens([path.join(REPO, CATALOG)], known, REPO);
    expect(findings).toEqual([]);
  });

  it("walks a single file when given one", async () => {
    const file = path.join(REPO, CATALOG, "core/actions/button/button.yaml");
    const css = path.join(
      REPO,
      CATALOG,
      "core/actions/button/examples/html/button.css",
    );
    expect(await Array.fromAsync(sourceFiles(file))).toEqual([]);
    expect(await Array.fromAsync(sourceFiles(css))).toEqual([css]);
  });
});

describe("scanHtml", () => {
  it("reads <style> blocks and inline style attributes", () => {
    const html = [
      "<style>",
      "  [data-lacquer='x'] { color: var(--lq-color-fg-default); }",
      "</style>",
      '<div style="color: #fff; padding: 4px">a</div>',
      "<p style='border-radius: 12px'>b</p>",
    ].join("\n");
    const findings = scanHtml(html, "x.html", known);
    expect(findings.map((f) => [f.evidence, f.location.line])).toEqual([
      ["#fff", 4],
      ["12px", 5],
    ]);
  });
});

describe("scanClasses", () => {
  it("reports the token and line of a class literal in TSX", () => {
    const tsx = [
      'import { cn } from "cn";',
      "export const x = cn(",
      '  "inline-flex rounded-lq-control bg-lq-bg-primary",',
      '  "shadow-md hover:bg-zinc-800",',
      ");",
    ].join("\n");
    const findings = scanClasses(
      tsx,
      "registry/lacquer/actions/button/button.tsx",
      known,
    );
    expect(findings.map((f) => [f.location.snippet, f.location.line])).toEqual([
      ["shadow-md", 4],
      ["hover:bg-zinc-800", 4],
    ]);
    expect(findings[0].component).toBe("button");
  });
});
