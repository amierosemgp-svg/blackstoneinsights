import Image from "next/image";

interface Props {
  ticker: string;
  exchange?: string;
  bannerUrl?: string;
  alt?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

/**
 * Square basalt tile. Shows the issuer image when there is one,
 * otherwise the ticker cut into the stone.
 */
export function TickerTile({ ticker, exchange, bannerUrl, alt, className = "", sizes, priority }: Props) {
  return (
    <div className={`slab chisel relative overflow-hidden rounded-[4px] ${className}`}>
      {bannerUrl ? (
        <Image
          src={bannerUrl}
          alt={alt ?? ticker}
          fill
          priority={priority}
          sizes={sizes ?? "(max-width: 640px) 100vw, 200px"}
          className="object-contain object-center p-3"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-start justify-end p-4">
          <span className="font-serif text-[clamp(2rem,7vw,3.25rem)] leading-none tracking-tight">
            {ticker}
          </span>
          {exchange && <span className="mt-2 text-xs text-on-basalt-muted">{exchange}</span>}
        </div>
      )}
    </div>
  );
}
