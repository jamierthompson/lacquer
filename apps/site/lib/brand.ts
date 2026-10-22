import dark from "@lacquer/core/tokens/dark.tokens.json" with { type: "json" };
import tokens from "@lacquer/core/tokens/lacquer.tokens.json" with { type: "json" };

/**
 * The brand colors for the places that cannot read a custom property: the
 * favicon and the share image, rendered to PNG by Satori. Each is the sRGB
 * fallback the token carries beside its OKLCH value, so these stay the
 * theme's own colors and the build keeps them in step (an OKLCH token whose
 * hex drifts fails `pnpm check`).
 */
export const brand = {
  black: tokens.color.bg.primary.$value.hex,
  bone: dark.color.fg.default.$value.hex,
  muted: dark.color.fg.muted.$value.hex,
  accent: dark.color.accent.brand.$value.hex,
};
