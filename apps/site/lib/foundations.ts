/**
 * The foundations the site has a page for, in reading order.
 *
 * A `tokens` foundation renders the roles in its categories from the
 * compiled bindings (dist/bindings.json): every role with its description,
 * its light and dark value and a specimen, so the page can never disagree
 * with the theme. A `principle` renders the structured sections of its
 * spec in packages/core/spec/catalog/ai/foundations/<id>/.
 */
export type Foundation = {
  slug: string;
  title: string;
  blurb: string;
} & (
  | {
      kind: "tokens";
      /** Token categories (the first path segment) this page shows. */
      categories: string[];
    }
  | { kind: "principle"; id: string }
);

export const FOUNDATIONS: Foundation[] = [
  {
    slug: "color",
    title: "Color",
    blurb:
      "A palette in OKLCH, with every text and boundary pairing proven at build time.",
    kind: "tokens",
    categories: ["color"],
  },
  {
    slug: "typography",
    title: "Typography",
    blurb:
      "Two family roles and text styles as whole settings a component reads with one role.",
    kind: "tokens",
    categories: ["type"],
  },
  {
    slug: "spacing",
    title: "Spacing and density",
    blurb: "Insets, gaps, control heights, and the prose measure.",
    kind: "tokens",
    categories: ["space", "size"],
  },
  {
    slug: "shape",
    title: "Shape and surface",
    blurb: "Radius, elevations, borders, and the focus ring.",
    kind: "tokens",
    categories: ["radius", "shadow", "focus", "opacity", "z"],
  },
  {
    slug: "motion",
    title: "Motion",
    blurb:
      "Two durations, one easing, a spin and a pulse; every animation has a reduced-motion fallback.",
    kind: "tokens",
    categories: ["motion", "shimmer"],
  },
  {
    slug: "live-region-strategy",
    title: "Live-region strategy",
    blurb: "How screen-reader users experience streaming.",
    kind: "principle",
    id: "live-region-strategy",
  },
  {
    slug: "reduced-motion-streaming",
    title: "Reduced-motion streaming",
    blurb:
      "Three sanctioned streaming animations, each with a token and a fallback.",
    kind: "principle",
    id: "reduced-motion-streaming",
  },
  {
    slug: "stop-regenerate-always",
    title: "Stop and regenerate, always",
    blurb: "The two controls that make probabilistic, slow output tolerable.",
    kind: "principle",
    id: "stop-regenerate-always",
  },
  {
    slug: "never-fake-confidence",
    title: "Never fake confidence",
    blurb:
      "No UI that implies certainty, verification, or activity the backend cannot substantiate.",
    kind: "principle",
    id: "never-fake-confidence",
  },
];

export const foundationBySlug = (slug: string) =>
  FOUNDATIONS.find((f) => f.slug === slug);
