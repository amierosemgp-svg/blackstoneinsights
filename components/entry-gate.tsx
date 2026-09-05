"use client";

import { useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { SITE } from "@/lib/site";

const STORAGE_KEY = "bsi-terms-accepted";

const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

function readAccepted(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

/** Server renders without the gate; the client decides after hydration. */
function serverSnapshot(): boolean {
  return true;
}

/**
 * First-visit acknowledgement. Reports are visible only after the reader
 * accepts that the authors may hold positions in covered issuers.
 */
export function EntryGate() {
  const accepted = useSyncExternalStore(subscribe, readAccepted, serverSnapshot);
  const open = !accepted;

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  function accept() {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* private mode: gate reappears next visit */
    }
    listeners.forEach((cb) => cb());
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="gate-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[rgba(28,28,28,0.7)] p-0 sm:p-6"
    >
      <div className="slab chisel w-full sm:max-w-xl rounded-t-[6px] sm:rounded-[6px] p-6 sm:p-8">
        <p className="font-display text-xs tracking-[0.2em] text-on-basalt-muted">{SITE.name}</p>
        <h2 id="gate-title" className="font-serif mt-3 text-2xl sm:text-3xl leading-tight">
          Before you read
        </h2>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-on-basalt-muted">
          <p>
            Our reports are opinion, drawn from public records, and are not investment advice. You should assume
            that as of the publication date the authors and their affiliates may hold a short position in any
            issuer covered, and stand to profit if its share price falls.
          </p>
          <p>
            By continuing you agree to the{" "}
            <Link href="/disclaimer" className="underline text-on-basalt">
              Terms of Use and Disclaimer
            </Link>
            , and confirm you are not in a jurisdiction where reading this material is unlawful.
          </p>
        </div>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={accept}
            className="rounded-[4px] bg-on-basalt text-basalt px-5 py-2.5 text-sm font-medium hover:bg-white transition-colors"
          >
            I agree, show me the research
          </button>
          <a
            href="https://www.google.com"
            className="rounded-[4px] border border-on-basalt-muted px-5 py-2.5 text-sm text-on-basalt-muted hover:text-on-basalt hover:border-on-basalt text-center no-underline transition-colors"
          >
            I do not agree
          </a>
        </div>
      </div>
    </div>
  );
}
