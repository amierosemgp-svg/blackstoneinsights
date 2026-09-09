interface Props {
  rating: string;
  size?: "sm" | "md";
  /** Render on the basalt slab */
  onDark?: boolean;
}

function toneFor(rating: string): "short" | "long" | "neutral" {
  const r = rating.toUpperCase();
  if (r.startsWith("SHORT")) return "short";
  if (r.startsWith("LONG")) return "long";
  return "neutral";
}

const TONE_STYLES = {
  short: { background: "var(--short)", color: "#fff", borderColor: "var(--short)" },
  long: { background: "var(--long)", color: "#fff", borderColor: "var(--long)" },
  neutral: { background: "transparent", color: "inherit", borderColor: "currentColor" },
} as const;

export function RatingTag({ rating, size = "sm", onDark = false }: Props) {
  const tone = toneFor(rating);
  const style: React.CSSProperties = { ...TONE_STYLES[tone] };
  if (tone === "neutral" && onDark) style.color = "var(--on-basalt)";
  const pad = size === "md" ? "px-3 py-1.5 text-sm" : "px-2 py-1 text-xs";
  return (
    <span
      className={`inline-flex items-center font-medium rounded-[3px] border whitespace-nowrap ${pad}`}
      style={style}
    >
      {rating}
    </span>
  );
}
