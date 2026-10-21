import { loadRegistry } from "shadcn/registry";

// Prerendered at build from registry.json and its includes; served live in dev.
export const dynamic = "force-static";

export async function GET() {
  const registry = await loadRegistry();
  return Response.json(registry);
}
