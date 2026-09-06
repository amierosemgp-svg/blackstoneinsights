import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getReportBySlug, getReportSlugs } from "@/lib/reports";
import { formatPublicationDate, tickerLabel } from "@/lib/format";
import { SITE } from "@/lib/site";

export const alt = "Black Stone Insights report";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getReportSlugs().map((slug) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const report = getReportBySlug(slug);
  const title = report?.title ?? SITE.name;
  const meta = report
    ? `${tickerLabel(report.ticker, report.exchange)}, ${formatPublicationDate(report.publicationDate)}`
    : SITE.tagline;
  const rating = report?.rating ?? "";
  const isShort = rating.toUpperCase().startsWith("SHORT");
  const logo = await readFile(path.join(process.cwd(), "public", "logo-plate.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: "#202124",
          color: "#f4f2ec",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 26, letterSpacing: 4 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <img src={logoSrc} width={56} height={56} alt="" />
            <span>{SITE.name.toUpperCase()}</span>
          </span>
          {rating && (
            <span
              style={{
                fontSize: 22,
                letterSpacing: 0,
                padding: "8px 16px",
                borderRadius: 4,
                background: isShort ? "#a2261e" : "transparent",
                border: isShort ? "none" : "2px solid #b6b3aa",
              }}
            >
              {rating}
            </span>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 30, color: "#b6b3aa", marginBottom: 20 }}>{meta}</div>
          <div style={{ fontSize: title.length > 70 ? 52 : 64, lineHeight: 1.08, letterSpacing: -1 }}>{title}</div>
        </div>
      </div>
    ),
    size
  );
}
