import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-3xl flex-col justify-center gap-6 px-4 py-12 sm:px-6">
      <h1 className="text-4xl font-semibold tracking-tight">Lacquer</h1>
      <p className="max-w-prose text-lg leading-8 text-muted-foreground">
        An AI-native design system. The finishing school for AI-generated UI:
        every component has a contract, is built from it, and is graded against
        it before it ships.
      </p>
      <nav className="flex gap-4 text-sm">
        <Link className="underline underline-offset-4" href="/docs">
          Docs
        </Link>
        <Link className="underline underline-offset-4" href="/r/registry.json">
          Registry
        </Link>
      </nav>
    </main>
  );
}
