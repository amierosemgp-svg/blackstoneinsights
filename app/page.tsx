import Link from "next/link";
import { getAllReports, getCoverageStats, toSummary, type Report } from "@/lib/reports";
import { formatPublicationDate, tickerLabel } from "@/lib/format";
import { SITE } from "@/lib/site";
import { RatingTag } from "@/components/rating-tag";
import { TickerTile } from "@/components/ticker-tile";
import { ReportCard } from "@/components/report-card";

const HOME_LIST_SIZE = 6;

export default function Home() {
  const reports = getAllReports();
  const lead = reports[0];
  const rest = reports.slice(1, 1 + HOME_LIST_SIZE);
  const stats = getCoverageStats(reports);

  return (
    <>
      {lead && <LeadReport report={lead} />}

      <section className="border-b border-rule bg-surface">
        <dl className="mx-auto max-w-6xl px-5 sm:px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-y-5 text-sm">
          <Stat value={stats.reports} label="reports published" />
          <Stat value={stats.exchanges} label="exchanges covered" />
          <Stat value={stats.closedCases} label="closed cases documented" />
          <Stat value={stats.earliestYear} label="earliest record reviewed" />
        </dl>
      </section>

      <section className="mx-auto max-w-6xl px-5 sm:px-6 pt-16 pb-4 grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-7">
          <h2 className="font-serif text-3xl sm:text-4xl leading-[1.12] tracking-tight max-w-xl">
            Where the filings and the economics disagree, we publish the record.
          </h2>
        </div>
        <div className="md:col-span-5 text-base text-muted leading-relaxed space-y-4">
          <p>
            {SITE.name} writes long-form investigations of listed issuers. We work from SEC and exchange filings,
            court dockets, corporate registries and primary sources, and we cite every claim so a reader can check
            it.
          </p>
          <p>
            We also keep a library of closed cases and retrospectives from the forensic-short genre, because the
            patterns repeat.{" "}
            <Link href="/about" className="text-foreground">
              How we work
            </Link>
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 sm:px-6 py-12">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="font-serif text-2xl tracking-tight">Recent reports</h2>
          <Link href="/reports" className="text-sm">
            All {reports.length} reports
          </Link>
        </div>
        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {rest.map((r) => (
            <ReportCard key={r.slug} report={toSummary(r)} />
          ))}
        </ul>
      </section>
    </>
  );
}

function Stat({ value, label }: { value: number | string; label: string }) {
  return (
    <div>
      <dt className="sr-only">{label}</dt>
      <dd className="flex items-baseline gap-2">
        <span className="font-serif text-3xl tabular-nums tracking-tight">{value}</span>
        <span className="text-muted">{label}</span>
      </dd>
    </div>
  );
}

function LeadReport({ report }: { report: Report }) {
  const title = report.heroTitle ?? report.title;
  const subtitle = report.heroSubtitle ?? report.subtitle;
  return (
    <section className="slab">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 py-14 sm:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
        <div className="lg:col-span-8">
          <p className="text-sm text-on-basalt-muted">
            Latest report, {formatPublicationDate(report.publicationDate)}
          </p>
          <p className="mt-6 text-lg sm:text-xl">{tickerLabel(report.ticker, report.exchange)}</p>
          <h1 className="font-serif mt-2 text-4xl sm:text-5xl lg:text-[3.6rem] leading-[1.04] tracking-tight max-w-3xl">
            {title}
          </h1>
          {subtitle && (
            <p className="font-serif mt-5 text-xl sm:text-2xl italic leading-snug text-on-basalt-muted max-w-2xl">
              {subtitle}
            </p>
          )}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href={`/reports/${report.slug}`}
              className="inline-flex items-center rounded-[4px] bg-on-basalt text-basalt px-5 py-2.5 text-sm font-medium no-underline hover:bg-white transition-colors"
            >
              Read the report
            </Link>
            {report.pdfUrl && (
              <a
                href={report.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-[4px] border border-on-basalt-muted px-5 py-2.5 text-sm no-underline hover:border-on-basalt transition-colors"
              >
                Download PDF
              </a>
            )}
            <RatingTag rating={report.rating} size="md" onDark />
          </div>
        </div>
        <Link
          href={`/reports/${report.slug}`}
          aria-label={title}
          className="lg:col-span-4 block no-underline"
        >
          <TickerTile
            ticker={report.ticker}
            exchange={report.exchange}
            bannerUrl={report.bannerUrl}
            alt={report.bannerAlt ?? report.issuer}
            className="aspect-square max-w-xs lg:max-w-none lg:ml-auto ring-1 ring-white/10"
            sizes="(max-width: 1024px) 320px, 360px"
            priority
          />
        </Link>
      </div>
    </section>
  );
}
