import Link from "next/link";
import Image from "next/image";
import { SITE } from "@/lib/site";

const NAV = [
  { href: "/reports", label: "Reports", mobile: true },
  { href: "/about", label: "About", mobile: true },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-background/90 backdrop-blur border-b border-rule">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 h-16 flex items-center justify-between gap-6">
        <Link href="/" className="no-underline text-foreground flex items-center gap-3">
          <Wordmark />
        </Link>
        <nav aria-label="Main" className="flex items-center gap-5 sm:gap-7 text-sm">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`text-foreground no-underline hover:underline whitespace-nowrap ${n.mobile ? "" : "hidden sm:inline"}`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <Image
        src={light ? "/logo-plate.png" : "/logo.png"}
        alt=""
        aria-hidden
        width={32}
        height={32}
        className="h-8 w-8 object-contain"
        priority
      />
      <span className={`font-display text-[13px] sm:text-base tracking-[0.14em] whitespace-nowrap ${light ? "text-on-basalt" : "text-foreground"}`}>
        {SITE.name.toUpperCase()}
      </span>
    </span>
  );
}
