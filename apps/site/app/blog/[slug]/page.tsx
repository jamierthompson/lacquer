import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { blogSource } from "@/lib/source";
import { getMDXComponents } from "@/mdx-components";

type Props = { params: Promise<{ slug: string }> };

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogSource.getPage([slug]);
  if (!post) notFound();
  const MDX = post.data.body;
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <article>
        <nav aria-label="Breadcrumb" className="mb-lq-inset-sm text-sm">
          <Link
            href="/blog"
            className="rounded-lq-sm text-lq-fg-muted hover:text-lq-fg-default"
          >
            Blog
          </Link>
        </nav>
        <header className="mb-8">
          <p className="font-lq-mono text-sm text-lq-accent-brand">
            {post.data.date}
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {post.data.title}
          </h1>
          {post.data.description ? (
            <p className="mt-2 max-w-lq-measure-prose leading-7 text-lq-fg-muted">
              {post.data.description}
            </p>
          ) : null}
        </header>
        {/* Until the prose and code-block compositions exist, the MDX body is styled here, on roles. */}
        <div className="flex flex-col gap-lq-gap-md leading-7 [&_a]:text-lq-fg-link [&_a]:underline-offset-4 [&_a:hover]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-lq-border-default [&_blockquote]:pl-lq-inset-sm [&_blockquote]:text-lq-fg-muted [&_code]:rounded-lq-sm [&_code]:bg-lq-bg-surface-tertiary [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-lq-mono [&_code]:text-sm [&_h2]:mt-6 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_li]:ml-5 [&_ol]:list-decimal [&_pre]:overflow-x-auto [&_pre]:rounded-lq-surface [&_pre]:bg-lq-bg-surface-tertiary [&_pre]:p-lq-inset-md [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_table]:w-full [&_table]:text-sm [&_td]:border-t [&_td]:border-lq-border-subtle [&_td]:px-2 [&_td]:py-1 [&_td]:align-top [&_th]:px-2 [&_th]:py-1 [&_th]:text-left [&_th]:text-xs [&_th]:text-lq-fg-muted [&_ul]:list-disc">
          <MDX components={getMDXComponents()} />
        </div>
      </article>
    </main>
  );
}

export function generateStaticParams() {
  return blogSource.getPages().map((p) => ({ slug: p.slugs[0] }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogSource.getPage([slug]);
  if (!post) notFound();
  return { title: post.data.title, description: post.data.description };
}
