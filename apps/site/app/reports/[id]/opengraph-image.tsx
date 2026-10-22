import { ImageResponse } from "next/og";

import { brand } from "@/lib/brand";
import { loadReport, reportIds } from "@/lib/reports";

export const alt = "A Lacquer finish report";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  return (await reportIds()).map((id) => ({ id }));
}

/** The share image: the letter, the component, the summary line, on the brand. */
export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const report = await loadReport(id);
  const letter = report?.score.letter ?? "?";
  const overall = report?.score.overall ?? 0;
  const passing =
    report?.states?.filter((s) => s.status === "pass").length ?? 0;
  const required = report?.states?.filter((s) => s.required).length ?? 0;
  const must = report?.findings.filter((f) => f.level === "MUST").length ?? 0;
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
        <div style={{ fontSize: 28, color: brand.muted, marginLeft: 12 }}>
          finish report
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 56 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: 240,
            height: 240,
            border: `3px solid ${brand.muted}`,
            borderRadius: 24,
          }}
        >
          <div
            style={{
              fontSize: 160,
              fontWeight: 600,
              lineHeight: 1,
              color: letter === "A" ? brand.accent : brand.bone,
            }}
          >
            {letter}
          </div>
          <div style={{ fontSize: 28, color: brand.muted }}>
            {`${overall} / 100`}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              display: "flex",
              fontSize: 72,
              fontWeight: 600,
              lineHeight: 1.05,
              letterSpacing: -2,
            }}
          >
            {report?.component ?? id}
          </div>
          <div style={{ display: "flex", fontSize: 30, color: brand.muted }}>
            {`${must === 0 ? "Zero MUST findings." : `${must} MUST finding${must === 1 ? "" : "s"}.`} ${passing} of ${required} states pass.`}
          </div>
        </div>
      </div>
    </div>,
    size,
  );
}
