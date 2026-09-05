import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use and Disclaimer",
};

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-6 py-12 sm:py-16">
      <h1 className="font-serif text-4xl sm:text-5xl tracking-tight leading-[1.08]">Terms of Use and Disclaimer</h1>
      <div className="prose-report mt-10">
        <p>
          By downloading from this site or otherwise reading any report by {SITE.name} (the “Reports”), you agree to
          the following Terms of Use. You agree that use of the Reports is at your own risk. In no event will you
          hold {SITE.name}, any affiliated party, or any related person liable for any direct or indirect trading
          losses caused by any information in the Reports.
        </p>

        <h2>For informational purposes only</h2>
        <p>
          The Reports are not intended as, and shall not be construed as, financial, legal, investment, tax, or
          other advice, nor a recommendation to buy, sell, or hold any security or other investment. The Reports
          do not represent an offer or solicitation to buy or sell any security. The information contained in the
          Reports is presented “as is” without warranty of any kind, express or implied.
        </p>

        <h2>Sources and accuracy</h2>
        <p>
          Reports rely on public sources believed to be accurate and reliable, including securities filings, court
          records, regulatory disclosures, corporate registries, news articles, and primary materials such as
          corporate websites and public social-media profiles. {SITE.name} makes no representation or warranty as
          to the accuracy or completeness of any information contained in the Reports. Public information can
          change, and the analyses, conclusions, and opinions expressed in the Reports are based on information
          available as of the date of publication.
        </p>

        <h2>Opinions</h2>
        <p>
          Interpretations, characterisations and conclusions in the Reports are the opinions of the authors, held
          in good faith and based on the sources cited. Nothing in a Report should be read as a statement that any
          person has committed fraud or any other unlawful act unless a court or regulator has so found.
        </p>

        <h2>No confidential relationship</h2>
        <p>
          Use of the Reports does not create any client, advisory, fiduciary, or professional relationship between
          you and {SITE.name} or any of its affiliates.
        </p>

        <h2>Positions</h2>
        <p>
          As of the publication date of any Report, {SITE.name} and/or its affiliates and/or any party associated
          with us (collectively, the “Authors”) may have a short position in the securities (and/or related
          derivatives) of an issuer covered in the Report, and the Authors stand to realise gains in the event that
          the price of those securities declines. The Authors may transact in the securities of any covered issuer
          at any time, and may be long, short, or neutral, in their sole discretion, without updating any prior
          Report.
        </p>

        <h2>Third-party reports</h2>
        <p>
          Closed cases and retrospectives describe research originally published by other firms. {SITE.name} did
          not author those reports, makes no claim of authorship, and summarises publicly reported developments
          for study of the genre. Verify with primary sources before relying on any item.
        </p>

        <h2>Forward-looking statements</h2>
        <p>
          The Reports may contain forward-looking statements, estimates, projections, and opinions on issuers. Such
          statements involve substantial uncertainty and risk and are not guarantees of future performance or
          results.
        </p>

        <h2>Jurisdiction</h2>
        <p>
          The Reports are not directed at, and are not intended for use by, any person in any jurisdiction where
          such use would be contrary to applicable law.
        </p>
      </div>
    </div>
  );
}
