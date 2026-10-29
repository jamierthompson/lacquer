import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
      <h1 className="font-heading text-4xl font-semibold tracking-tight">
        Lacquer
      </h1>
      <Button
        nativeButton={false}
        render={<a href="https://github.com/jamierthompson/lacquer" />}
      >
        View on GitHub
      </Button>
    </main>
  );
}
