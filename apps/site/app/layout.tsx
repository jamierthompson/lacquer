import { NextProvider } from "fumadocs-core/framework/next";
import type { Metadata } from "next";
import Link from "next/link";

import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const SITE_URL = "https://lacquer.dev";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Lacquer", template: "%s · Lacquer" },
  description:
    "An AI-native design system. The finishing school for AI-generated UI.",
  openGraph: {
    siteName: "Lacquer",
    type: "website",
    url: SITE_URL,
  },
  twitter: { card: "summary_large_image" },
};

const NAV = [
  { href: "/foundations", label: "Foundations" },
  { href: "/reports", label: "Reports" },
  { href: "/blog", label: "Blog" },
  { href: "/docs", label: "Docs" },
  { href: "/r/registry.json", label: "Registry" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-svh flex-col">
        <NextProvider>
          <ThemeProvider>
            <header className="border-b border-lq-border-subtle">
              <div className="mx-auto flex h-lq-control-lg w-full max-w-5xl items-center justify-between px-4 sm:px-6">
                <Link
                  href="/"
                  className="flex items-center gap-lq-gap-sm rounded-lq-sm font-semibold tracking-tight"
                >
                  <span
                    aria-hidden="true"
                    className="size-lq-icon-sm rounded-lq-sm bg-lq-accent-brand"
                  />
                  Lacquer
                </Link>
                <nav aria-label="Site">
                  <ul className="flex items-center gap-lq-gap-md text-sm">
                    {NAV.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="rounded-lq-sm text-lq-fg-muted transition-colors duration-lq-fast ease-lq-standard hover:text-lq-fg-default"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </header>
            <div className="flex-1">{children}</div>
            <footer className="border-t border-lq-border-subtle">
              <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-lq-gap-sm px-4 py-lq-inset-md text-xs text-lq-fg-muted sm:px-6">
                <p>
                  Lacquer is MIT licensed. Every value on this site is a token
                  role; press{" "}
                  <kbd className="rounded-lq-sm border border-lq-border-default bg-lq-bg-surface-secondary px-1 font-lq-mono">
                    d
                  </kbd>{" "}
                  to flip the theme.
                </p>
                <a
                  href="https://github.com/jamierthompson/lacquer"
                  className="rounded-lq-sm text-lq-fg-link underline-offset-4 hover:underline"
                >
                  GitHub
                </a>
              </div>
            </footer>
          </ThemeProvider>
        </NextProvider>
      </body>
    </html>
  );
}
