"use client";

import { useMemo, useState } from "react";
import type { ReportKind, ReportSummary } from "@/lib/report-types";
import { KIND_LABELS } from "@/lib/report-types";
import { ReportCard } from "./report-card";

type Filter = "all" | ReportKind;

const FILTERS: Array<{ id: Filter; label: string }> = [
  { id: "all", label: "All reports" },
  { id: "active", label: KIND_LABELS.active + "s" },
  { id: "closed", label: KIND_LABELS.closed + "s" },
  { id: "case-study", label: "Case studies" },
  { id: "retrospective", label: KIND_LABELS.retrospective + "s" },
];

export function ReportsBrowser({ reports }: { reports: ReportSummary[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: reports.length, active: 0, closed: 0, "case-study": 0, retrospective: 0 };
    for (const r of reports) c[r.kind] += 1;
    return c;
  }, [reports]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return reports.filter((r) => {
      if (filter !== "all" && r.kind !== filter) return false;
      if (!q) return true;
      const hay = [r.title, r.issuer, r.ticker, r.exchange, r.summary, ...(r.tags ?? [])].join(" ").toLowerCase();
      return hay.includes(q);
    });
  }, [reports, filter, query]);

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div role="tablist" aria-label="Report type" className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {FILTERS.filter((f) => counts[f.id] > 0).map((f) => {
            const active = f.id === filter;
            return (
              <button
                key={f.id}
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(f.id)}
                className={`pb-1 border-b-2 transition-colors ${
                  active ? "border-foreground text-foreground" : "border-transparent text-muted hover:text-foreground"
                }`}
              >
                {f.label}
                <span className="ml-1.5 text-faint tabular-nums">{counts[f.id]}</span>
              </button>
            );
          })}
        </div>
        <label className="relative block md:w-72">
          <span className="sr-only">Search reports</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by issuer, ticker or topic"
            className="w-full bg-surface border border-rule rounded-[4px] px-3 py-2 text-sm placeholder:text-faint focus:border-foreground focus:outline-none"
          />
        </label>
      </div>

      {visible.length > 0 ? (
        <ul className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {visible.map((r) => (
            <ReportCard key={r.slug} report={r} />
          ))}
        </ul>
      ) : (
        <div className="mt-6 border border-dashed border-rule rounded-[4px] p-10 text-center text-sm text-muted">
          No reports match “{query}”. Try a ticker or an issuer name.
        </div>
      )}
    </div>
  );
}
