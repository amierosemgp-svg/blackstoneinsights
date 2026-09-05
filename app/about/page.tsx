import type { Metadata } from "next";
import Link from "next/link";
import { getAllReports, getCoverageStats } from "@/lib/reports";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: "Who Black Stone Insights is, how we research, and how we disclose positions.",
};

const METHOD = [
  {
    title: "Start from the filings",
    body: "Annual reports, prospectuses, 6-Ks and 8-Ks, auditor letters, proxy statements. We read the footnotes before the press releases, and we track what changes between versions.",
  },
  {
    title: "Check the record outside the filings",
    body: "Court dockets, corporate registries in every jurisdiction the group touches, property and lien records, customs data, archived web pages, and the people named in the documents.",
  },
  {
    title: "Look for the pattern, not the smoking gun",
    body: "A single odd fact is noise. Auditor turnover plus related-party cash movements plus a share-structure change inside a short window is a pattern. We write up the pattern and say how confident we are.",
  },
  {
    title: "Report the absences",
    body: "Where a search finds nothing, we say so. A thesis that only lists what supports it is a pitch, not research.",
  },
  {
    title: "Cite everything",
    body: "Every factual claim carries a source a reader can open. Interpretations are marked as opinion.",
  },
];

export default function AboutPage() {
  const reports = getAllReports();
  const stats = getCoverageStats(reports);
  const active = reports.filter((r) => r.kind === "active").slice(0, 8);

  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-6 py-12 sm:py-16">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-7">
          <h1 className="font-serif text-4xl sm:text-5xl tracking-tight leading-[1.08]">
            Research that holds up after the stock has moved.
          </h1>
          <div className="mt-8 space-y-5 text-lg leading-relaxed text-muted max-w-[62ch]">
            <p>
              {SITE.name} is an independent forensic equity research publisher. We investigate listed issuers whose
              public disclosures, in our opinion, do not match their economic substance, and we publish what the
              public record shows.
            </p>
            <p>
              We are short sellers. We say so on every report, and you should assume we hold a position in any
              active issuer we cover on the day we publish. Our interest is aligned with being right, not with being
              loud.
            </p>
            <p>
              Alongside our own work we maintain a library of closed cases and retrospectives on well-known
              campaigns by other publishers. The same mechanisms recur across markets and decades, and a reader who
              has studied Sino-Forest, Wirecard and Nikola will recognise them faster the next time.
            </p>
          </div>
        </div>
        <aside className="md:col-span-5 md:pl-8">
          <dl className="bg-surface border border-rule rounded-[4px] divide-y divide-rule text-sm">
            <Row k="Reports published" v={String(stats.reports)} />
            <Row k="Issuers covered" v={String(stats.issuers)} />
            <Row k="Exchanges" v={String(stats.exchanges)} />
            <Row k="Closed cases documented" v={String(stats.closedCases)} />
            <Row k="Record reviewed since" v={String(stats.earliestYear)} />
          </dl>
          <p className="mt-4 text-sm text-muted">
            Counts update automatically as reports are published.
          </p>
        </aside>
      </div>

      <section className="mt-20">
        <h2 className="font-serif text-3xl tracking-tight">How we work</h2>
        <ol className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 max-w-5xl">
          {METHOD.map((m, i) => (
            <li key={m.title} className="grid grid-cols-[2.5rem_1fr] gap-4">
              <span className="font-serif text-3xl leading-none text-faint tabular-nums">{i + 1}</span>
              <div>
                <h3 className="font-medium text-lg">{m.title}</h3>
                <p className="mt-2 text-muted leading-relaxed">{m.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {active.length > 0 && (
        <section className="mt-20">
          <h2 className="font-serif text-3xl tracking-tight">Active coverage</h2>
          <ul className="mt-6 divide-y divide-rule border-y border-rule max-w-3xl">
            {active.map((r) => (
              <li key={r.slug}>
                <Link href={`/reports/${r.slug}`} className="flex justify-between gap-6 py-3.5 no-underline text-foreground group">
                  <span className="font-serif text-lg group-hover:underline">{r.title}</span>
                  <span className="text-sm text-muted whitespace-nowrap">{r.rating}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-20 max-w-[62ch]">
        <h2 className="font-serif text-3xl tracking-tight">Why “Black Stone”</h2>
        <p className="mt-5 text-lg leading-relaxed text-muted">
          Basalt is what is left when everything softer has weathered away. A report should be the same: once the
          narrative, the promotion and the price action have eroded, the documented record is what remains. We
          try to write only what will still stand.
        </p>
      </section>

      <section className="mt-20 max-w-[62ch]">
        <h2 className="font-serif text-3xl tracking-tight">Contact</h2>
        <p className="mt-5 text-lg leading-relaxed text-muted">
          Press, issuers who wish to respond, and readers with corrections can write to{" "}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. If you have information about a listed company,{" "}
          <Link href="/tips">send a tip</Link>.
        </p>
      </section>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="px-4 py-3 flex justify-between gap-4">
      <dt className="text-muted">{k}</dt>
      <dd className="font-serif text-xl leading-none tabular-nums">{v}</dd>
    </div>
  );
}
