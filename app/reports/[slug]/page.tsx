import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import { getAllReports, getReportBySlug, getReportSlugs, KIND_LABELS, type Report } from "@/lib/reports";
import { extractToc } from "@/lib/toc";
import { formatPublicationDate, formatShortDate, tickerLabel } from "@/lib/format";
import { SITE } from "@/lib/site";
import { RatingTag } from "@/components/rating-tag";

export function generateStaticParams() {
  return getReportSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata(props: PageProps<"/reports/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const report = getReportBySlug(slug);
  if (!report) return { title: "Report not found" };
  return {
    title: report.title,
    description: report.summary,
    openGraph: {
      type: "article",
      title: report.title,
      description: report.summary,
      publishedTime: report.publicationDate,
      url: `${SITE.url}/reports/${report.slug}`,
    },
  };
}

export default async function ReportPage(props: PageProps<"/reports/[slug]">) {
  const { slug } = await props.params;
  const report = getReportBySlug(slug);
  if (!report) notFound();

  const toc = extractToc(report.body);
  const others = getAllReports().filter((r) => r.slug !== report.slug).slice(0, 5);

  return (
    <article>
      {report.bannerUrl && (
        <figure className="slab">
          <div className="relative w-full h-[280px] sm:h-[400px]">
            <Image
              src={report.bannerUrl}
              alt={report.bannerAlt ?? report.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1200px"
              className="object-contain object-center"
            />
          </div>
          {(report.bannerCaption || report.bannerCredit) && (
            <figcaption className="mx-auto max-w-6xl px-5 sm:px-6 py-3 text-xs text-on-basalt-muted flex flex-wrap gap-x-3">
              {report.bannerCaption && <span>{report.bannerCaption}</span>}
              {report.bannerCredit && <span className="italic">{report.bannerCredit}</span>}
            </figcaption>
          )}
        </figure>
      )}

      <header className="bg-surface border-b border-rule">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 pt-10 pb-10">
          <Link href="/reports" className="text-sm text-muted no-underline hover:underline">
            All reports
          </Link>
          <p className="mt-6 text-base">
            <span className="font-medium">{tickerLabel(report.ticker, report.exchange)}</span>
            <span className="text-muted">, {formatPublicationDate(report.publicationDate)}</span>
          </p>
          <h1 className="font-serif mt-3 text-3xl sm:text-5xl leading-[1.08] tracking-tight max-w-4xl">
            {report.title}
          </h1>
          {report.subtitle && (
            <p className="font-serif mt-4 text-xl sm:text-2xl italic text-muted leading-snug max-w-3xl">
              {report.subtitle}
            </p>
          )}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <RatingTag rating={report.rating} size="md" />
            <span className="text-sm text-muted">{KIND_LABELS[report.kind]}</span>
            {report.pdfUrl && (
              <a
                href={report.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-[4px] bg-basalt text-on-basalt px-4 py-2 text-sm font-medium no-underline hover:bg-basalt-2 transition-colors"
              >
                Download PDF
              </a>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 sm:px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <aside className="lg:col-span-4 lg:order-2">
          <div className="lg:sticky lg:top-24 space-y-8">
            <FactBox report={report} />
            {toc.length > 1 && <Toc entries={toc} />}
          </div>
        </aside>

        <div className="lg:col-span-8 lg:order-1">
          <div className="prose-report">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeSlug]}
              components={{
                table: ({ children }) => (
                  <div className="table-scroll">
                    <table>{children}</table>
                  </div>
                ),
              }}
            >
              {report.body}
            </ReactMarkdown>
          </div>
          <Disclosure />
        </div>
      </div>

      {others.length > 0 && <MoreReports reports={others} />}
    </article>
  );
}

function FactBox({ report }: { report: Report }) {
  const rows: Array<[string, string | undefined]> = [
    ["Issuer", report.issuer],
    ["Ticker", tickerLabel(report.ticker, report.exchange)],
    ["Reference price", report.referencePrice],
    ["12-month price target", report.priceTarget],
    ["Implied downside", report.downside],
    ["Published", formatPublicationDate(report.publicationDate)],
  ];
  const visible = rows.filter(([, v]) => Boolean(v));
  return (
    <dl className="bg-surface border border-rule rounded-[4px] text-sm divide-y divide-rule">
      {visible.map(([k, v]) => (
        <div key={k} className="px-4 py-3 grid grid-cols-[9rem_1fr] gap-3">
          <dt className="text-muted">{k}</dt>
          <dd className="text-foreground">{v}</dd>
        </div>
      ))}
      {report.tags && report.tags.length > 0 && (
        <div className="px-4 py-3 flex flex-wrap gap-1.5">
          {report.tags.map((t) => (
            <span key={t} className="rounded-[3px] bg-background border border-rule px-2 py-0.5 text-xs text-muted">
              {t}
            </span>
          ))}
        </div>
      )}
    </dl>
  );
}

function Toc({ entries }: { entries: ReturnType<typeof extractToc> }) {
  return (
    <nav aria-label="In this report" className="hidden lg:block text-sm">
      <p className="font-medium mb-3">In this report</p>
      <ol className="space-y-1.5 border-l border-rule">
        {entries.map((e) => (
          <li key={e.id} className={e.level === 1 ? "pl-3" : "pl-6"}>
            <a
              href={`#${e.id}`}
              className={`block no-underline hover:underline leading-snug ${
                e.level === 1 ? "text-foreground" : "text-muted"
              }`}
            >
              {e.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function Disclosure() {
  return (
    <aside className="mt-16 border-t-2 border-foreground pt-5 text-sm leading-relaxed text-muted max-w-[68ch]">
      <p>
        <strong className="text-foreground font-medium">Disclosure.</strong> This report is opinion, published for
        informational and educational purposes, and is not investment advice or an offer or solicitation to buy or
        sell any security. Statements about the issuer are based on public information believed to be reliable, but
        we make no representation as to its accuracy or completeness. As of the publication date, {SITE.name} and
        its affiliates may hold short positions in the securities of the issuer covered, and stand to realise gains
        if the price of those securities declines. Read the full{" "}
        <Link href="/disclaimer">Terms of Use and Disclaimer</Link>.
      </p>
    </aside>
  );
}

function MoreReports({ reports }: { reports: Report[] }) {
  return (
    <section className="border-t border-rule bg-surface">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 py-12">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-serif text-2xl tracking-tight">More reports</h2>
          <Link href="/reports" className="text-sm">
            All reports
          </Link>
        </div>
        <ul className="divide-y divide-rule">
          {reports.map((r) => (
            <li key={r.slug}>
              <Link href={`/reports/${r.slug}`} className="grid sm:grid-cols-[10rem_1fr_8rem] gap-2 sm:gap-6 py-4 no-underline text-foreground group">
                <span className="text-sm font-medium">{tickerLabel(r.ticker, r.exchange)}</span>
                <span className="font-serif text-lg leading-snug group-hover:underline">{r.title}</span>
                <span className="text-sm text-muted sm:text-right">{formatShortDate(r.publicationDate)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
