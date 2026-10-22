/** Colour measurements over computed-style strings, through colorjs.io. */
import Color from "colorjs.io";

/** Alpha-0 or `transparent`: nothing is painted. */
export function isTransparent(value: string): boolean {
  if (!value || value === "transparent") return true;
  try {
    return new Color(value).alpha === 0;
  } catch {
    return false;
  }
}

/** WCAG 2.x relative luminance, or null when the value is not a colour. */
export function luminance(value: string): number | null {
  try {
    return new Color(value).luminance;
  } catch {
    return null;
  }
}

/** WCAG 2.x contrast ratio between two colours; NaN when either is not a colour. */
export function contrast(a: string, b: string): number {
  try {
    return new Color(a).contrast(new Color(b), "WCAG21");
  } catch {
    return Number.NaN;
  }
}
