import { getAllReports } from "@/lib/reports";
import { SITE } from "@/lib/site";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const reports = getAllReports().sort(
    (a, b) => +new Date(b.publicationDate) - +new Date(a.publicationDate)
  );
  const items = reports
    .map((r) => {
      const url = `${SITE.url}/reports/${r.slug}`;
      return `    <item>
      <title>${escapeXml(r.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(r.publicationDate).toUTCString()}</pubDate>
      <description>${escapeXml(r.summary)}</description>${
        r.pdfUrl ? `\n      <enclosure url="${SITE.url}${r.pdfUrl}" type="application/pdf" length="0" />` : ""
      }
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE.name)}</title>
    <link>${SITE.url}</link>
    <atom:link href="${SITE.url}/feed.xml" rel="self" type="application/rss+xml" />
    <description>${escapeXml(SITE.description)}</description>
    <language>en</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
