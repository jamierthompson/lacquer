import type { MDXComponents } from "mdx/types";

/** Components passed to every compiled MDX body. Lacquer's own go here. */
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return { ...components };
}
