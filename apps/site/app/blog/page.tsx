import type { Metadata } from "next";
import Link from "next/link";

import { blogSource } from "@/lib/source";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Written alongside the work: the message state machine, composing components, the agent loop.",
};

export default function BlogPage() {
  const posts = blogSource
    .getPages()
    .sort((a, b) => b.data.date.localeCompare(a.data.date));
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <header className="mb-lq-inset-lg">
        <h1 className="text-3xl font-semibold tracking-tight">Blog</h1>
        <p className="mt-2 max-w-lq-measure-prose text-lq-fg-muted">
          Written alongside the work, one post per milestone.
        </p>
      </header>
      <ul className="flex flex-col gap-lq-gap-md">
        {posts.map((post) => (
          <li key={post.url}>
            <Link
              href={post.url}
              className="flex flex-col gap-lq-gap-xs rounded-lq-surface border border-lq-border-default p-lq-inset-md transition-colors duration-lq-fast ease-lq-standard hover:bg-lq-bg-accent"
            >
              <span className="font-lq-mono text-xs text-lq-fg-muted">
                {post.data.date}
              </span>
              <span className="text-xl font-semibold tracking-tight">
                {post.data.title}
              </span>
              {post.data.description ? (
                <span className="leading-7 text-lq-fg-muted">
                  {post.data.description}
                </span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
