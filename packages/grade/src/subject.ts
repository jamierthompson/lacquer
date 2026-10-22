/**
 * What the grader opens. A spec registers its implementations; each becomes
 * a subject:
 *
 * - `page`: an html reference (`examples/html/<id>.html` with its stylesheet
 *   beside it), opened in Chromium over file://, every instance driven
 *   through the states the spec names.
 * - `module`: a registry item's lib file, imported in Node and exercised
 *   directly: the message state machine's table and reducer.
 *
 * A React component in the registry becomes a `page` subject once the site
 * has a harness route that renders its states file; that driver lands with
 * the first composition.
 */
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { type CatalogComponent, resolvePath } from "@lacquer/core";

export type Subject =
  | {
      kind: "page";
      renderer: string;
      component: string;
      /** Absolute path of the page. */
      file: string;
      /** Absolute paths of the stylesheets that are part of the implementation. */
      styles: string[];
    }
  | {
      kind: "module";
      renderer: string;
      component: string;
      package: string;
      /** Absolute path of the module the grader imports. */
      file: string;
      /** Every code file the item ships, absolute. */
      files: string[];
    };

const exists = (p: string) =>
  access(p).then(
    () => true,
    () => false,
  );

/** Every file of a subject, for hashing and for the static scans. */
export const subjectFiles = (s: Subject): string[] =>
  s.kind === "page" ? [s.file, ...s.styles] : s.files;

interface RegistryFile {
  path: string;
  type: string;
  target?: string;
}
interface RegistryItem {
  name: string;
  files?: RegistryFile[];
}

/** The registry item by name, with its files made absolute, from the site's chunked registry. */
async function registryItem(
  site: string,
  name: string,
): Promise<{ item: RegistryItem; dir: string } | null> {
  const root = JSON.parse(
    await readFile(path.join(site, "registry.json"), "utf8"),
  ) as { include?: string[]; items?: RegistryItem[] };
  const chunks = [
    { file: path.join(site, "registry.json"), items: root.items ?? [] },
  ];
  for (const inc of root.include ?? []) {
    const file = path.join(site, inc);
    const chunk = JSON.parse(await readFile(file, "utf8")) as {
      items?: RegistryItem[];
    };
    chunks.push({ file, items: chunk.items ?? [] });
  }
  for (const c of chunks)
    for (const item of c.items)
      if (item.name === name) return { item, dir: path.dirname(c.file) };
  return null;
}

const CODE = /^registry:(lib|hook|component|ui|block)$/;

export async function subjectsFor(
  spec: CatalogComponent,
  repo: string,
): Promise<Subject[]> {
  const out: Subject[] = [];
  for (const impl of spec.implementations ?? []) {
    if (impl.file) {
      const file = resolvePath(path.join(spec.path, impl.file));
      const css = file.replace(/\.html?$/, ".css");
      out.push({
        kind: "page",
        renderer: impl.renderer,
        component: spec.id,
        file,
        styles: (await exists(css)) ? [css] : [],
      });
    } else if (impl.package) {
      const name = impl.package.replace(/^@lacquer\//, "");
      const found = await registryItem(path.join(repo, "apps/site"), name);
      if (!found)
        throw new Error(
          `${spec.id}: implementation ${impl.package} is not a registry item`,
        );
      const files = (found.item.files ?? [])
        .filter((f) => CODE.test(f.type))
        .map((f) => path.join(found.dir, f.path));
      const lib = (found.item.files ?? []).find(
        (f) => f.type === "registry:lib",
      );
      if (!lib)
        throw new Error(
          `${spec.id}: ${impl.package} ships no registry:lib file`,
        );
      out.push({
        kind: "module",
        renderer: impl.renderer,
        component: spec.id,
        package: impl.package,
        file: path.join(found.dir, lib.path),
        files,
      });
    }
  }
  return out;
}
