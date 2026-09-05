export type ReportRating =
  | "SHORT"
  | "SHORT — High conviction"
  | "LONG"
  | "NEUTRAL"
  | (string & {});

/** Editorial category derived from the rating string. */
export type ReportKind = "active" | "closed" | "case-study" | "retrospective";

export interface ReportFrontmatter {
  title: string;
  subtitle?: string;
  issuer: string;
  ticker: string;
  exchange?: string;
  publicationDate: string;
  rating: ReportRating;
  priceTarget?: string;
  referencePrice?: string;
  downside?: string;
  pdfUrl?: string;
  summary: string;
  tags?: string[];
  bannerUrl?: string;
  bannerAlt?: string;
  bannerCaption?: string;
  bannerCredit?: string;
  hidden?: boolean;
  featured?: boolean;
  /** Display title for the homepage hero; falls back to `title`. */
  heroTitle?: string;
  /** Display subtitle for the homepage hero; falls back to `subtitle`. */
  heroSubtitle?: string;
}

export interface Report extends ReportFrontmatter {
  slug: string;
  body: string;
  kind: ReportKind;
}

/** Lightweight shape safe to pass to client components. */
export type ReportSummary = Omit<Report, "body">;

export const KIND_LABELS: Record<ReportKind, string> = {
  active: "Active short",
  closed: "Closed case",
  "case-study": "Case study",
  retrospective: "Retrospective",
};

export function classifyRating(rating: string): ReportKind {
  const r = rating.toUpperCase();
  if (r.includes("CLOSED")) return "closed";
  if (r.includes("CASE STUDY") || r.startsWith("NOT RATED")) return "case-study";
  if (r.startsWith("NEUTRAL") || r.includes("COUNTER")) return "retrospective";
  return "active";
}
