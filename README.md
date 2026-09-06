# Black Stone Insights — web

Forensic equity research publisher at [blackstoneinsights.io](https://blackstoneinsights.io). Next.js App Router, Tailwind 4, markdown reports.

## Run

```bash
pnpm install
pnpm dev        # http://localhost:9050
pnpm build
```

## Publish a report

1. Write `content/reports/<ticker>-<mon><day>-<year>.md` with YAML frontmatter (see any existing file). Required: `title`, `issuer`, `ticker`, `publicationDate`, `rating`, `summary`. Optional: `subtitle`, `exchange`, `priceTarget`, `referencePrice`, `downside`, `tags`, `bannerUrl`, `bannerAlt`, `bannerCaption`, `bannerCredit`, `pdfUrl`, `hidden`, `featured`, `heroTitle`, `heroSubtitle`.
2. Put the issuer image in `public/banners/` and reference it with `bannerUrl`. Reports without an image get a ticker tile automatically.
3. Set `featured: true` on the one report that should lead the homepage. If none is featured, the newest report leads.
4. Optional PDF: `./scripts/build-report-pdf.sh <slug>` (needs pandoc, weasyprint, python3) writes `public/reports/<slug>.pdf`; set `pdfUrl` to `/reports/<slug>.pdf`.

The rating string drives the report category shown in filters: anything containing "Closed" is a closed case, "NOT RATED" or "Case study" is a case study, "NEUTRAL" or "Counter" is a retrospective, everything else is an active short.

## Routes

`/` home, `/reports` filterable index, `/reports/[slug]` report, `/about`, `/disclaimer`, `/feed.xml` RSS, `/sitemap.xml`, `/robots.txt`. Each report also gets a generated OpenGraph image.
