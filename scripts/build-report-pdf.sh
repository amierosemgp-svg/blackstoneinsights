#!/usr/bin/env bash
# Render content/reports/<slug>.md → public/reports/<slug>.pdf
# Usage: ./scripts/build-report-pdf.sh <slug>
# Requires: pandoc, weasyprint, python3 + pyyaml
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "usage: $0 <slug>" >&2
  exit 1
fi

SLUG="$1"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/content/reports/$SLUG.md"
OUT="$ROOT/public/reports/$SLUG.pdf"
CSS="$ROOT/scripts/report-pdf.css"

if [[ ! -f "$SRC" ]]; then
  echo "not found: $SRC" >&2
  exit 1
fi

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# Extract frontmatter as JSON via python (gray-matter equivalent)
python3 - "$SRC" "$TMP/meta.json" "$TMP/body.md" <<'PY'
import sys, json, re, pathlib

src = pathlib.Path(sys.argv[1]).read_text()
m = re.match(r"^---\n(.*?)\n---\n(.*)$", src, re.DOTALL)
if not m:
    print("no frontmatter found", file=sys.stderr)
    sys.exit(1)
fm_text, body = m.group(1), m.group(2)

# minimal YAML parser for our flat frontmatter
meta = {}
for line in fm_text.splitlines():
    if not line.strip() or line.lstrip().startswith("#"):
        continue
    k, _, v = line.partition(":")
    k = k.strip()
    v = v.strip()
    if v.startswith('"') and v.endswith('"'):
        v = v[1:-1]
    elif v.startswith("[") and v.endswith("]"):
        # simple list
        v = [s.strip().strip('"') for s in v[1:-1].split(",") if s.strip()]
    meta[k] = v

pathlib.Path(sys.argv[2]).write_text(json.dumps(meta))
pathlib.Path(sys.argv[3]).write_text(body)
PY

META_FILE="$TMP/meta.json"
BODY_FILE="$TMP/body.md"

# Build the cover HTML using values from frontmatter
python3 - "$META_FILE" "$TMP/cover.html" <<'PY'
import sys, json, html, pathlib, datetime

meta = json.loads(pathlib.Path(sys.argv[1]).read_text())

def esc(s):
    return html.escape(str(s)) if s else ""

def fmt_date(s):
    try:
        d = datetime.datetime.strptime(s, "%Y-%m-%d")
        return d.strftime("%B %-d, %Y")
    except Exception:
        return s

ticker_line = []
if meta.get("exchange"):
    ticker_line.append(f"{esc(meta['exchange'])}: {esc(meta.get('ticker',''))}")
elif meta.get("ticker"):
    ticker_line.append(esc(meta['ticker']))

meta_bits = []
if meta.get("rating"):
    meta_bits.append(f'<span class="badge">{esc(meta["rating"])}</span>')
if meta.get("priceTarget"):
    meta_bits.append(f"12-mo PT: {esc(meta['priceTarget'])}")
if meta.get("downside"):
    meta_bits.append(f"Downside: {esc(meta['downside'])}")
if meta.get("publicationDate"):
    meta_bits.append(esc(fmt_date(meta["publicationDate"])))

cover = f"""
<section class="cover">
  <p class="cover-brand"><strong>Black Stone Insights</strong> &nbsp;·&nbsp; Forensic Equity Research</p>
  <p class="cover-meta">{' '.join(ticker_line)}</p>
  <h1>{esc(meta.get('title',''))}</h1>
  <p class="subtitle">{esc(meta.get('subtitle',''))}</p>
  <p class="cover-meta">{' <span class="sep">·</span> '.join(meta_bits)}</p>
</section>
"""
pathlib.Path(sys.argv[2]).write_text(cover)
PY

# Convert markdown body to HTML (with GitHub-flavored tables)
pandoc "$BODY_FILE" -f gfm-tex_math_dollars -t html5 -o "$TMP/body.html"

# Build a static disclaimer block
cat > "$TMP/disclaimer.html" <<'HTML'
<section class="disclaimer">
<h1>Disclaimer</h1>
<p>This report is for informational and educational purposes only and is not investment advice or an offer or solicitation to buy or sell any security. Statements regarding companies discussed herein are based on public information believed to be reliable but no representation, express or implied, is made as to its accuracy or completeness. As of the publication date, Black Stone Insights and/or its affiliates may hold short positions in the securities of the issuer covered, and stand to realize gains in the event the price of the issuer's securities declines. The Authors may transact in the securities of any covered issuer at any time, and may be long, short, or neutral, in their sole discretion, without updating any prior report.</p>
<p>The report may contain forward-looking statements, estimates, projections, and opinions which involve substantial uncertainty and risk and are not guarantees of future performance or results. The report is not directed at, and is not intended for use by, any person in any jurisdiction where such use would be contrary to applicable law.</p>
<p>© Black Stone Insights. All rights reserved.</p>
</section>
HTML

# Stitch full HTML document
cat > "$TMP/full.html" <<HTML
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>Black Stone Insights Report</title></head>
<body>
$(cat "$TMP/cover.html")
$(cat "$TMP/body.html")
$(cat "$TMP/disclaimer.html")
</body>
</html>
HTML

mkdir -p "$(dirname "$OUT")"
weasyprint "$TMP/full.html" "$OUT" -s "$CSS" 2>&1 | grep -v "^$" || true

if [[ -f "$OUT" ]]; then
  SIZE=$(stat -f%z "$OUT" 2>/dev/null || stat -c%s "$OUT")
  PAGES=$(pdfinfo "$OUT" 2>/dev/null | grep '^Pages:' | awk '{print $2}')
  echo "wrote $OUT  (${SIZE} bytes, ${PAGES:-?} pages)"
else
  echo "weasyprint did not produce $OUT" >&2
  exit 1
fi
