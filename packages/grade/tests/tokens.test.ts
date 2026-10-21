import { readFile } from "node:fs/promises";
import path from "node:path";
import { loadBindings } from "@lacquer/core";
import { describe, expect, it } from "vitest";

import {
  checkTokens,
  classViolation,
  literalsIn,
  scanClasses,
  scanCss,
} from "../src/checks/tokens.ts";

const REPO = path.resolve(import.meta.dirname, "../../..");
const CATALOG = "packages/core/spec/catalog";
const bindings = await loadBindings();
const known = new Set(Object.values(bindings.html.roles).map((r) => r.var));

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
    ])
      expect(classViolation(c, known), c).not.toBeNull();
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

  it("passes every reference stylesheet in the catalog", async () => {
    const findings = await checkTokens([path.join(REPO, CATALOG)], known, REPO);
    expect(findings).toEqual([]);
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
