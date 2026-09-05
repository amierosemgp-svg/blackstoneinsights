import GithubSlugger from "github-slugger";

export interface TocEntry {
  id: string;
  text: string;
  level: 1 | 2;
}

/**
 * Pull h1/h2 headings out of markdown, skipping fenced code blocks.
 * Uses the same slugger as rehype-slug so anchors match the rendered ids.
 */
export function extractToc(markdown: string): TocEntry[] {
  const slugger = new GithubSlugger();
  const entries: TocEntry[] = [];
  let inFence = false;
  for (const line of markdown.split("\n")) {
    if (line.trim().startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m = /^(#{1,2})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!m) continue;
    const text = m[2].replace(/[*_`]/g, "");
    entries.push({ id: slugger.slug(text), text, level: m[1].length as 1 | 2 });
  }
  return entries;
}
