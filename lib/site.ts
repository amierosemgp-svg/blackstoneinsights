export const SITE = {
  name: "Black Stone Insights",
  shortName: "BSI",
  tagline: "Forensic equity research, set in stone.",
  description:
    "Independent forensic equity research. Public-record investigations of listed issuers, published with sources.",
  url: "https://blackstoneinsights.io",
  email: "hello@blackstoneinsights.io",
  tipsEmail: "tips@blackstoneinsights.io",
  twitter: "https://x.com/blackstoneinsights",
  foundedYear: 2013,
} as const;

/** Optional mailing-list form action (e.g. Buttondown, Mailchimp). Falls back to mailto. */
export const SUBSCRIBE_FORM_ACTION = process.env.NEXT_PUBLIC_SUBSCRIBE_FORM_ACTION ?? "";
