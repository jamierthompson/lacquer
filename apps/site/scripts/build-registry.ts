/**
 * @lacquer/core's compiled bindings -> registry/lacquer/foundations/registry.json
 *
 * The foundations group holds one item, `base`: the Lacquer theme as a
 * shadcn `registry:base` item that `shadcn init <site>/r/base.json` installs
 * into a new project. It carries the `--lq-*` token values (light and dark)
 * and the Tailwind theme aliases, all read from dist/bindings.json so the
 * item, the site's stylesheet and the spec layer's reference theme can never
 * disagree. Component items are added to their group files by hand as each
 * composition goes through the loop.
 *
 *   node scripts/build-registry.ts          write the file
 *   node scripts/build-registry.ts --check  exit 1 if the committed file is stale
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import bindings from "@lacquer/core/bindings.json" with { type: "json" };

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FILE = path.join(SITE, "registry/lacquer/foundations/registry.json");
const SITE_URL = "https://lacquer.dev";

/** shadcn's cssVars keys are property names without the leading `--`. */
const strip = (vars: Record<string, string>) =>
  Object.fromEntries(
    Object.entries(vars).map(([property, value]) => [
      property.replace(/^--/, ""),
      value,
    ]),
  );

/** The light values of the roles dark changes: what a scoped `.light` restores. */
const lightOverrides = () => {
  const light: Record<string, string> = bindings.theme.light;
  return Object.fromEntries(
    Object.keys(bindings.theme.dark).map((property) => [
      property,
      light[property],
    ]),
  );
};

export function baseItem() {
  return {
    name: "base",
    type: "registry:base",
    extends: "none",
    title: "Lacquer",
    author: "Jamie Thompson (https://lacquer.dev)",
    description:
      "The Lacquer theme: every token role as a --lq-* custom property in light and dark, bound to Tailwind utilities (bg-lq-bg-primary, rounded-lq-control), with Base UI, cn, cva and lucide installed and the @lacquer registry registered. Run `shadcn init https://lacquer.dev/r/base.json` in a new project, then add components.",
    // The base names its own style, as shadcn's from-scratch example does
    // (`my-design-system`): with `extends: "none"` it inherits no shadcn style
    // and installs none. Bare registry dependencies (`utils`) still resolve,
    // since the CLI reads them from its Tailwind v4 index whatever the style.
    config: {
      style: "lacquer",
      iconLibrary: "lucide",
      tailwind: { baseColor: "neutral" },
      registries: { "@lacquer": `${SITE_URL}/r/{name}.json` },
    },
    dependencies: [
      "@base-ui/react",
      "class-variance-authority",
      "cn",
      "lucide-react",
    ],
    registryDependencies: ["utils"],
    files: [],
    cssVars: {
      theme: strip(bindings.aliases),
      light: strip(bindings.theme.light),
      dark: strip(bindings.theme.dark),
    },
    // The theme convention, the same one the generated stylesheets carry:
    // cssVars puts light on :root and dark on .dark; this adds the system
    // preference as the default and a scoped .light, so a consumer with no
    // theme switcher follows the OS and one with next-themes overrides it.
    css: {
      ":root": { "color-scheme": "light" },
      "@media (prefers-color-scheme: dark)": {
        ":root:not(.light)": {
          "color-scheme": "dark",
          ...bindings.theme.dark,
        },
      },
      ".dark": { "color-scheme": "dark" },
      ".light": { "color-scheme": "light", ...lightOverrides() },
      "@layer base": {
        "@media (prefers-reduced-motion: reduce)": {
          "*, ::before, ::after": {
            "animation-duration": "0.01ms !important",
            "animation-iteration-count": "1 !important",
            "transition-duration": "0.01ms !important",
            "scroll-behavior": "auto !important",
          },
        },
      },
    },
    meta: {
      bindings: ["html", "tailwind"],
      roles: Object.keys(bindings.html.roles).length,
      spec: "packages/core/spec/tokens",
    },
    docs: "Dark mode follows the system preference by default; a `light` or `dark` class on <html> (next-themes, not installed by this item) or on any scope overrides it. The family roles are the platform stacks; set a brand face by overriding --lq-type-family-sans and --lq-type-family-mono. Lacquer components read token roles only, through the --lq-* properties and the lq- utilities (LQ-TOKEN-01); retheme by overriding --lq-* on :root and .dark. The roles and their values live in packages/core/spec/tokens (DTCG 2025.10), in OKLCH with every contrast pairing checked by the build; this item is generated from them.",
  };
}

export function render(): string {
  return `${JSON.stringify(
    {
      $schema: "https://ui.shadcn.com/schema/registry.json",
      items: [baseItem()],
    },
    null,
    2,
  )}\n`;
}

async function main() {
  const check = process.argv.includes("--check");
  const next = render();
  const current = await readFile(FILE, "utf8").catch(() => "");
  if (current === next) return;
  if (check) {
    console.error(
      `stale: ${path.relative(SITE, FILE)}. Run: pnpm --filter @lacquer/site registry`,
    );
    process.exit(1);
  }
  await writeFile(FILE, next);
  console.log(`wrote ${path.relative(SITE, FILE)}`);
}

if (import.meta.main ?? process.argv[1]?.endsWith("build-registry.ts"))
  await main();
