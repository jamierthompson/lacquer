# Lacquer

A Next.js app built with shadcn/ui on Base UI.

## Stack

- [Next.js 16](https://nextjs.org) (App Router) and React 19
- [shadcn/ui](https://ui.shadcn.com) on [Base UI](https://base-ui.com), Tailwind CSS 4
- TypeScript 7, Biome (lint), Prettier (format)
- Deployed on [Vercel](https://vercel.com)

## Getting started

Requires Node 24 (see `.nvmrc`).

```bash
nvm use
npm install
npm run dev
```

Open http://localhost:3000.

## Scripts

| Script              | Description           |
| ------------------- | --------------------- |
| `npm run dev`       | Start the dev server  |
| `npm run build`     | Production build      |
| `npm run lint`      | Lint with Biome       |
| `npm run format`    | Format with Prettier  |
| `npm run typecheck` | Type-check with `tsc` |

## Adding components

```bash
npx shadcn@latest add <component>
```

The project includes the shadcn MCP server (`.mcp.json`) and the shadcn skill (`.claude/skills/shadcn`) for coding agents.

## License

[MIT](LICENSE)
