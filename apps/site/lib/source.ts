import { loader } from "fumadocs-core/source";
import { frontmatterSchema } from "fumadocs-mdx/config";
import { defineDocs } from "fumadocs-mdx/macro";
import { z } from "zod";

// Macro API: the bundler compiles content/<dir>/**.mdx into each collection.
// `dir` must be a string literal and each must be a top-level const.
export const docs = defineDocs({ dir: "content/docs" });

export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
});

/** The blog: one post per file, dated, in reading order on /blog. */
export const blog = defineDocs({
  dir: "content/blog",
  docs: {
    schema: frontmatterSchema.extend({
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    }),
  },
});

export const blogSource = loader({
  baseUrl: "/blog",
  source: blog.toFumadocsSource(),
});
