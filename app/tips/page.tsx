import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Send a tip",
  description: "How to share information about a listed company with Black Stone Insights.",
};

export default function TipsPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-6 py-12 sm:py-16 grid grid-cols-1 md:grid-cols-12 gap-10">
      <div className="md:col-span-7">
        <h1 className="font-serif text-4xl sm:text-5xl tracking-tight leading-[1.08]">Send a tip</h1>
        <div className="mt-8 space-y-5 text-lg leading-relaxed text-muted max-w-[62ch]">
          <p>
            Many of the best forensic findings start with someone who saw a document they were not supposed to
            see, or noticed that a warehouse was empty. If you have information about a listed company, we want
            to read it.
          </p>
          <p>
            Write to <a href={`mailto:${SITE.tipsEmail}`}>{SITE.tipsEmail}</a>. Include the company name and
            ticker, what you observed, and whether you can share documents. We read everything and reply when we
            can.
          </p>
        </div>
        <a
          href={`mailto:${SITE.tipsEmail}?subject=${encodeURIComponent("Tip: [company name and ticker]")}`}
          className="mt-8 inline-flex items-center rounded-[4px] bg-basalt text-on-basalt px-5 py-2.5 text-sm font-medium no-underline hover:bg-basalt-2 transition-colors"
        >
          Email {SITE.tipsEmail}
        </a>
      </div>
      <aside className="md:col-span-5 md:pl-8">
        <div className="bg-surface border border-rule rounded-[4px] p-6 text-sm leading-relaxed space-y-4">
          <h2 className="font-medium text-base">What to know before you write</h2>
          <p className="text-muted">
            We never identify a source without written consent, and we do not need your name to act on what you
            send.
          </p>
          <p className="text-muted">
            We do not pay for information, and we do not accept material that was obtained unlawfully.
          </p>
          <p className="text-muted">
            For sensitive material, ask for our public key in your first message and we will reply with it
            before you send anything further.
          </p>
        </div>
      </aside>
    </div>
  );
}
