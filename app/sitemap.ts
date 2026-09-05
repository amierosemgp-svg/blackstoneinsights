import type { MetadataRoute } from "next";
import { getAllReports } from "@/lib/reports";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = ["", "/reports", "/about", "/tips", "/disclaimer"].map((p) => ({
    url: `${SITE.url}${p}`,
    changeFrequency: "weekly",
    priority: p === "" ? 1 : 0.6,
  }));
  const reports: MetadataRoute.Sitemap = getAllReports().map((r) => ({
    url: `${SITE.url}/reports/${r.slug}`,
    lastModified: new Date(r.publicationDate),
    changeFrequency: "monthly",
    priority: 0.8,
  }));
  return [...pages, ...reports];
}
