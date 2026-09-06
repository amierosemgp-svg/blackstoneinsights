import Link from "next/link";
import { SITE } from "@/lib/site";
import { Wordmark } from "./site-header";

export function SiteFooter() {
  return (
    <footer className="slab mt-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 py-14 grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-7">
          <Wordmark light />
          <p className="font-serif mt-5 text-xl leading-snug max-w-sm">{SITE.tagline}</p>
          <p className="mt-3 text-sm text-on-basalt-muted max-w-sm leading-relaxed">
            Long-form investigations of listed issuers whose disclosures, in our opinion, do not match their economic
            substance. Every claim is cited to a public record.
          </p>
        </div>
        <nav aria-label="Footer" className="md:col-span-5 text-sm">
          <ul className="space-y-2.5">
            <li><Link href="/reports" className="no-underline hover:underline">All reports</Link></li>
            <li><Link href="/about" className="no-underline hover:underline">About and method</Link></li>
            <li><Link href="/disclaimer" className="no-underline hover:underline">Terms of Use and Disclaimer</Link></li>
            <li><a href="/feed.xml" className="no-underline hover:underline">RSS feed</a></li>
            <li><a href={SITE.twitter} rel="noopener noreferrer" target="_blank" className="no-underline hover:underline">X (Twitter)</a></li>
            <li><a href={`mailto:${SITE.email}`} className="no-underline hover:underline">{SITE.email}</a></li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 py-5 text-xs text-on-basalt-muted flex flex-col sm:flex-row gap-2 sm:justify-between">
          <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          <p>Not investment advice. The authors may hold positions in issuers covered.</p>
        </div>
      </div>
    </footer>
  );
}
