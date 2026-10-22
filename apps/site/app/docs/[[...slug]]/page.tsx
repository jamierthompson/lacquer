import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { source } from "@/lib/source";
import { getMDXComponents } from "@/mdx-components";

type Props = { params: Promise<{ slug?: string[] }> };

export default async function DocsPage({ params }: Props) {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <article>
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">
            {page.data.title}
          </h1>
          {page.data.description ? (
            <p className="mt-2 text-lq-fg-muted">{page.data.description}</p>
          ) : null}
        </header>
        {page.data.toc.length > 0 ? (
          <nav aria-label="On this page" className="mb-8 text-sm">
            <ul className="flex flex-col gap-lq-gap-xs">
              {page.data.toc.map((item) => (
                <li
                  key={item.url}
                  style={{ paddingLeft: (item.depth - 2) * 12 }}
                >
                  <a
                    className="rounded-lq-sm text-lq-fg-muted transition-colors duration-lq-fast ease-lq-standard hover:text-lq-fg-default"
                    href={item.url}
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
        {/* Until the prose and code-block compositions exist, the MDX body is styled here, on roles. */}
        <div className="flex flex-col gap-lq-gap-md leading-7 [&_a]:text-lq-fg-link [&_a]:underline-offset-4 [&_a:hover]:underline [&_code]:rounded-lq-sm [&_code]:bg-lq-bg-surface-tertiary [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-lq-mono [&_code]:text-sm [&_h2]:mt-6 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_pre]:overflow-x-auto [&_pre]:rounded-lq-surface [&_pre]:bg-lq-bg-surface-tertiary [&_pre]:p-lq-inset-md [&_pre_code]:bg-transparent [&_pre_code]:p-0">
          <MDX components={getMDXComponents()} />
        </div>
      </article>
    </main>
  );
}

export function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();
  return {
    // The index is already called Lacquer; the layout template would double it.
    title: slug?.length ? page.data.title : { absolute: page.data.title },
    description: page.data.description,
  };
}
