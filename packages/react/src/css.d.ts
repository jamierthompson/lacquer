/**
 * Each component imports its entry's reference stylesheet from
 * @lacquer/core as a side effect; the consumer's bundler loads it. This
 * tells TypeScript the import resolves to nothing.
 */
declare module "*.css";
