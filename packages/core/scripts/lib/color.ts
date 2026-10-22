/**
 * The build's colour edge: OKLCH in, sRGB and a WCAG 2.x ratio out, all of
 * it colorjs.io's math. Nothing here generates, fits, clamps or rounds a
 * colour: the values in spec/tokens are written by hand, and this only
 * measures them. A colour outside sRGB is refused by name rather than
 * clipped, since a clipped colour would be measured as something the token
 * does not say. (The same contract as @jamiethompson/oklch, which this can
 * defer to once it is published.)
 */
import {
  contrast as colorjsContrast,
  inGamut,
  OKLCH,
  type PlainColorObject,
  parse,
  sRGB,
  to,
} from "colorjs.io/fn";

export interface Oklch {
  l: number;
  c: number;
  h: number;
}

/** sRGB components in 0..1, gamma-encoded. */
export type Rgb = [number, number, number];

/** colorjs.io's own tolerance for a channel that sits a hair outside 0..1. */
const GAMUT_EPSILON = 0.000075;

const oklch = ({ l, c, h }: Oklch): PlainColorObject => ({
  space: OKLCH,
  coords: [l, c, h],
  alpha: 1,
});

const srgb = (rgb: Rgb): PlainColorObject => ({
  space: sRGB,
  coords: rgb,
  alpha: 1,
});

/** Whether the colour is displayable in sRGB. */
export const inSrgb = (c: Oklch): boolean =>
  inGamut(oklch(c), sRGB, { epsilon: GAMUT_EPSILON });

/** The colour's sRGB components; throws if it is outside sRGB. */
export function oklchToSrgb(c: Oklch): Rgb {
  if (!inSrgb(c))
    throw new RangeError(
      `oklch(${c.l} ${c.c} ${c.h}) is outside sRGB; bring it into gamut by hand`,
    );
  return to(oklch(c), sRGB).coords as Rgb;
}

const channel = (x: number) =>
  Math.round(Math.min(1, Math.max(0, x)) * 255)
    .toString(16)
    .padStart(2, "0");

/** `#rrggbb` for an in-gamut OKLCH colour: the 8-bit sRGB fallback a token carries. */
export const toHex = (c: Oklch): string =>
  `#${oklchToSrgb(c).map(channel).join("")}`;

/** `#rrggbb` -> sRGB components. */
export function hexToSrgb(hex: string): Rgb {
  if (!/^#[0-9a-f]{6}$/i.test(hex))
    throw new Error(`not a 6-digit hex colour: ${hex}`);
  return to(parse(hex), sRGB).coords as Rgb;
}

/** WCAG 2.x contrast ratio, 1..21, independent of order. */
export const contrast = (a: Rgb, b: Rgb): number =>
  colorjsContrast(srgb(b), srgb(a), "WCAG21");
