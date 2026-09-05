const DATE_LONG = new Intl.DateTimeFormat("en-GB", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const DATE_SHORT = new Intl.DateTimeFormat("en-GB", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

function parseDate(input: string): Date | null {
  const d = new Date(input);
  return isNaN(d.getTime()) ? null : d;
}

export function formatPublicationDate(input: string): string {
  const d = parseDate(input);
  return d ? DATE_LONG.format(d) : input;
}

export function formatShortDate(input: string): string {
  const d = parseDate(input);
  return d ? DATE_SHORT.format(d) : input;
}

export function tickerLabel(ticker: string, exchange?: string): string {
  return exchange ? `${exchange}: ${ticker}` : ticker;
}
