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
            <p className="mt-2 text-muted-foreground">
              {page.data.description}
            </p>
          ) : null}
        </header>
        {page.data.toc.length > 0 ? (
          <nav aria-label="On this page" className="mb-8 text-sm">
            <ul className="flex flex-col gap-1">
              {page.data.toc.map((item) => (
                <li
                  key={item.url}
                  style={{ paddingLeft: (item.depth - 2) * 12 }}
                >
                  <a
                    className="text-muted-foreground hover:text-foreground"
                    href={item.url}
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
        <div className="flex flex-col gap-4 leading-7 [&_code]:rounded-[var(--radius)] [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm [&_h2]:mt-6 [&_h2]:text-xl [&_h2]:font-semibold [&_pre]:overflow-x-auto [&_pre]:rounded-[var(--radius)] [&_pre]:bg-muted [&_pre]:p-4 [&_pre_code]:bg-transparent [&_pre_code]:p-0">
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
