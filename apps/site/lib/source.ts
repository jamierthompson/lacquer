import { loader } from "fumadocs-core/source";
import { defineDocs } from "fumadocs-mdx/macro";

// Macro API: the bundler compiles content/docs/**.mdx into this collection.
// `dir` must be a string literal and this must be a top-level const.
export const docs = defineDocs({ dir: "content/docs" });

export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
});
