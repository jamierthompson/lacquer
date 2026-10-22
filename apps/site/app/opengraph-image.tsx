import { ImageResponse } from "next/og";

import { brand } from "@/lib/brand";

export const alt =
  "Lacquer. An AI-native design system. The finishing school for AI-generated UI.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** The share image: the brand on the lacquer black, set in the OG renderer's default face. */
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: brand.black,
        color: brand.bone,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div
          style={{
            width: 28,
            height: 28,
            background: brand.accent,
            borderRadius: 6,
          }}
        />
        <div style={{ fontSize: 40, fontWeight: 600, letterSpacing: -1 }}>
          Lacquer
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{
            fontSize: 72,
            fontWeight: 600,
            lineHeight: 1.05,
            letterSpacing: -2,
            maxWidth: 1056,
          }}
        >
          {/* A non-breaking hyphen: the renderer would otherwise wrap "AI-generated" at it. */}
          The finishing school for AI‑generated UI.
        </div>
        <div style={{ fontSize: 30, color: brand.muted }}>
          An AI-native design system. Every component has a contract and a
          grade.
        </div>
      </div>
    </div>,
    size,
  );
}
