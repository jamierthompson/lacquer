import {
  loadRegistry,
  loadRegistryItem,
  RegistryItemNotFoundError,
} from "shadcn/registry";

// Serves /r/<item>.json. Prerendered at build for every item in the registry
// and served live in dev. Next only treats a bare `[name]` folder as dynamic,
// so the `.json` suffix is part of the param and is stripped here.
export const dynamic = "force-static";
// A name outside generateStaticParams is a 404 at the edge. Rendering it on
// demand would run the loader inside a function that has no registry files.
export const dynamicParams = false;

const SUFFIX = ".json";

export async function generateStaticParams() {
  const registry = await loadRegistry();
  return registry.items.map((item) => ({ name: `${item.name}${SUFFIX}` }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name: file } = await params;
  if (!file.endsWith(SUFFIX)) {
    return Response.json({ error: "Not found." }, { status: 404 });
  }
  const name = file.slice(0, -SUFFIX.length);
  try {
    const item = await loadRegistryItem(name);
    return Response.json(item);
  } catch (error) {
    if (error instanceof RegistryItemNotFoundError) {
      return Response.json(
        { error: `Registry item "${name}" was not found.` },
        { status: 404 },
      );
    }
    throw error;
  }
}
