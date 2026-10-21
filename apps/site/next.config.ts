import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";

// Macro API on (default include: every JS/TS module outside node_modules);
// lib/source.ts is the only module that calls defineDocs.
const withMDX = createMDX();

const nextConfig: NextConfig = {};

export default withMDX(nextConfig);
