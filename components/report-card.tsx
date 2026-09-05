import Link from "next/link";
import type { ReportSummary } from "@/lib/report-types";
import { KIND_LABELS } from "@/lib/report-types";
import { formatShortDate, tickerLabel } from "@/lib/format";
import { RatingTag } from "./rating-tag";
import { TickerTile } from "./ticker-tile";

export function ReportCard({ report }: { report: ReportSummary }) {
  return (
    <li className="list-none">
      <Link
        href={`/reports/${report.slug}`}
        className="group grid grid-cols-[6.5rem_1fr] sm:grid-cols-[8rem_1fr] gap-5 bg-surface border border-rule rounded-[4px] p-4 sm:p-5 no-underline text-foreground transition-colors hover:border-foreground focus-visible:border-foreground h-full"
      >
        <TickerTile
          ticker={report.ticker}
          exchange={report.exchange}
          bannerUrl={report.bannerUrl}
          alt={report.bannerAlt ?? report.issuer}
          className="aspect-square"
          sizes="128px"
        />
        <div className="min-w-0 flex flex-col">
          <div className="flex items-center justify-between gap-3 text-sm text-muted">
            <span className="font-medium text-foreground">{tickerLabel(report.ticker, report.exchange)}</span>
            <time dateTime={report.publicationDate}>{formatShortDate(report.publicationDate)}</time>
          </div>
          <h3 className="font-serif mt-2 text-xl sm:text-[1.35rem] leading-snug tracking-tight group-hover:underline decoration-1 underline-offset-4">
            {report.title}
          </h3>
          {report.subtitle && (
            <p className="font-serif mt-1.5 text-base italic text-muted leading-snug line-clamp-2">
              {report.subtitle}
            </p>
          )}
          <div className="mt-auto pt-4 flex items-center gap-3 flex-wrap">
            <RatingTag rating={report.rating} />
            <span className="text-xs text-faint">{KIND_LABELS[report.kind]}</span>
          </div>
        </div>
      </Link>
    </li>
  );
}
