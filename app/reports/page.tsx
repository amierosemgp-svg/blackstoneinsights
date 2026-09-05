import type { Metadata } from "next";
import { getAllReports, toSummary } from "@/lib/reports";
import { ReportsBrowser } from "@/components/reports-browser";

export const metadata: Metadata = {
  title: "Reports",
  description: "Every Black Stone Insights report: active shorts, closed cases, case studies and retrospectives.",
};

export default function ReportsPage() {
  const reports = getAllReports().map(toSummary);
  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-6 py-12 sm:py-16">
      <h1 className="font-serif text-4xl tracking-tight">Reports</h1>
      <p className="mt-3 text-muted max-w-xl">
        Newest first. Active shorts carry a rating and price view; closed cases and retrospectives document how
        earlier campaigns by other publishers resolved.
      </p>
      <div className="mt-10">
        <ReportsBrowser reports={reports} />
      </div>
    </div>
  );
}
