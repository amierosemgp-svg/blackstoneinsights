"use client";

import { useState } from "react";
import { SITE, SUBSCRIBE_FORM_ACTION } from "@/lib/site";

export function SubscribeForm({ onDark = false }: { onDark?: boolean }) {
  const [email, setEmail] = useState("");
  const hasProvider = SUBSCRIBE_FORM_ACTION.length > 0;

  const inputClass = onDark
    ? "bg-transparent border-on-basalt-muted text-on-basalt placeholder:text-on-basalt-muted focus:border-on-basalt"
    : "bg-surface border-rule text-foreground placeholder:text-faint focus:border-foreground";
  const buttonClass = onDark
    ? "bg-on-basalt text-basalt hover:bg-white"
    : "bg-lapis text-white hover:bg-lapis-deep";

  function handleMailto(e: React.FormEvent) {
    if (hasProvider) return;
    e.preventDefault();
    const subject = encodeURIComponent("Subscribe to Black Stone Insights");
    const body = encodeURIComponent(`Please add ${email} to the report mailing list.`);
    window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${body}`;
  }

  return (
    <form
      action={hasProvider ? SUBSCRIBE_FORM_ACTION : undefined}
      method={hasProvider ? "post" : undefined}
      onSubmit={handleMailto}
      className="flex flex-col sm:flex-row gap-2 max-w-md"
    >
      <label className="flex-1">
        <span className="sr-only">Email address</span>
        <input
          type="email"
          name="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@firm.com"
          className={`w-full border rounded-[4px] px-3 py-2.5 text-sm focus:outline-none ${inputClass}`}
        />
      </label>
      <button type="submit" className={`rounded-[4px] px-4 py-2.5 text-sm font-medium transition-colors ${buttonClass}`}>
        Get new reports
      </button>
    </form>
  );
}
