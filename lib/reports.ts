import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { classifyRating, type Report, type ReportFrontmatter, type ReportSummary } from "./report-types";

export * from "./report-types";

const REPORTS_DIR = path.join(process.cwd(), "content", "reports");


export function getReportSlugs(): string[] {
  if (!fs.existsSync(REPORTS_DIR)) return [];
  return fs
    .readdirSync(REPORTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function getReportBySlug(slug: string): Report | null {
  const filePath = path.join(REPORTS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const fm = data as ReportFrontmatter;
  return { slug, body: content, kind: classifyRating(fm.rating), ...fm };
}

export function getAllReports(): Report[] {
  return getReportSlugs()
    .map((slug) => getReportBySlug(slug))
    .filter((r): r is Report => r !== null && !r.hidden)
    .sort((a, b) => {
      if (!!a.featured !== !!b.featured) return a.featured ? -1 : 1;
      return +new Date(b.publicationDate) - +new Date(a.publicationDate);
    });
}

export function toSummary(report: Report): ReportSummary {
  const { body: _body, ...rest } = report;
  void _body;
  return rest;
}

export interface CoverageStats {
  reports: number;
  issuers: number;
  exchanges: number;
  closedCases: number;
  earliestYear: number;
}

export function getCoverageStats(reports: Report[]): CoverageStats {
  const issuers = new Set(reports.map((r) => r.ticker));
  const exchanges = new Set(
    reports.flatMap((r) => (r.exchange ?? "").split("/").map((e) => e.trim()).filter(Boolean))
  );
  const years = reports.map((r) => new Date(r.publicationDate).getFullYear()).filter((y) => !isNaN(y));
  return {
    reports: reports.length,
    issuers: issuers.size,
    exchanges: exchanges.size,
    closedCases: reports.filter((r) => r.kind === "closed").length,
    earliestYear: years.length ? Math.min(...years) : new Date().getFullYear(),
  };
}
