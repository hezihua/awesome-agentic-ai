import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Locale } from "./i18n";
import { localePath } from "./i18n";

const CONTENT_DIR = path.join(process.cwd(), "content");

export type DocMeta = {
  slug: string[];
  title: string;
  description: string;
  content: string;
  filePath: string;
  readingTime: number;
  locale: Locale;
};

function estimateReadingTime(markdown: string): number {
  const chars = markdown.replace(/\s+/g, "").length;
  return Math.max(1, Math.round(chars / 500));
}

export function fileToSlug(relPath: string): string[] {
  const withoutExt = relPath
    .replace(/\.zh-Hans\.md$/i, "")
    .replace(/\.en\.md$/i, "")
    .replace(/\.md$/i, "")
    .replace(/\\/g, "/");
  return withoutExt.split("/").filter(Boolean);
}

/** Candidate files for a logical slug under a locale. */
export function slugToCandidates(slug: string[], locale: Locale): string[] {
  const joined = slug.join("/");
  const readme = (suffix: string) => path.posix.join(joined, `README${suffix}`);

  if (locale === "en") {
    return [
      `${joined}.en.md`,
      readme(".en.md"),
      `${joined}.md`,
      readme(".md"),
      `${joined}.zh-Hans.md`,
      readme(".zh-Hans.md"),
    ];
  }
  if (locale === "zh-TW") {
    return [
      `${joined}.md`,
      readme(".md"),
      `${joined}.zh-Hans.md`,
      readme(".zh-Hans.md"),
      `${joined}.en.md`,
      readme(".en.md"),
    ];
  }
  // zh-Hans
  return [
    `${joined}.zh-Hans.md`,
    readme(".zh-Hans.md"),
    `${joined}.md`,
    readme(".md"),
    `${joined}.en.md`,
    readme(".en.md"),
  ];
}

function localeOfFile(rel: string): Locale | "shared" {
  if (/\.zh-Hans\.md$/i.test(rel)) return "zh-Hans";
  if (/\.en\.md$/i.test(rel)) return "en";
  if (/\.md$/i.test(rel)) return "zh-TW";
  return "shared";
}

function walkMarkdownFiles(dir: string, base = ""): string[] {
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const rel = path.join(base, entry.name);
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walkMarkdownFiles(full, rel));
    } else if (/\.md$/i.test(entry.name) && entry.name !== "LICENSE") {
      // skip design-only docs
      if (/DESIGN\.md$/i.test(entry.name)) continue;
      out.push(rel.replace(/\\/g, "/"));
    }
  }
  return out;
}

function extractTitle(
  data: Record<string, unknown>,
  body: string,
  fallback: string
) {
  if (typeof data.title === "string" && data.title.trim()) return data.title.trim();
  if (typeof data.name === "string" && data.name.trim()) return data.name.trim();
  const h1 = body.match(/^#\s+(.+)$/m);
  if (h1) return h1[1].replace(/[*_`]/g, "").trim();
  return fallback;
}

function parseMarkdownFile(
  fullPath: string,
  rel: string,
  locale: Locale
): DocMeta {
  const raw = fs.readFileSync(fullPath, "utf-8");
  let data: Record<string, unknown> = {};
  let content = raw;

  try {
    const parsed = matter(raw);
    data = parsed.data as Record<string, unknown>;
    content = parsed.content;
  } catch {
    if (raw.startsWith("---")) {
      const end = raw.indexOf("\n---", 3);
      if (end !== -1) {
        content = raw.slice(end + 4).replace(/^\s*\n/, "");
        const nameMatch = raw.slice(0, end).match(/^name:\s*(.+)$/m);
        if (nameMatch) data.name = nameMatch[1].trim();
      }
    }
  }

  const slug = fileToSlug(rel);
  const title = extractTitle(data, content, slug.at(-1) || rel);
  const body = rewriteDocLinks(stripLocaleSwitcher(content), rel, locale);
  return {
    slug,
    title,
    description: typeof data.description === "string" ? data.description : "",
    content: body,
    filePath: rel,
    readingTime: estimateReadingTime(body),
    locale,
  };
}

/** Remove upstream in-doc language switchers (blockquote + HTML); use the site header instead. */
export function stripLocaleSwitcher(markdown: string): string {
  return markdown
    .replace(
      /^>\s*(?=.*繁體中文)(?=.*(?:简体中文|簡體中文))(?=.*English).+\n?/gm,
      ""
    )
    .replace(
      /<div\b[^>]*\balign=["']right["'][^>]*>[\s\S]*?繁體中文[\s\S]*?(?:简体中文|簡體中文)[\s\S]*?English[\s\S]*?<\/div>\s*/gi,
      ""
    )
    .replace(/\n{3,}/g, "\n\n");
}

const UPSTREAM_REPO =
  "https://github.com/WenyuChiou/awesome-agentic-ai-zh";
const UPSTREAM_BLOB = `${UPSTREAM_REPO}/blob/main/`;
const UPSTREAM_TREE = `${UPSTREAM_REPO}/tree/main/`;

function contentHasMarkdown(resolvedMd: string): boolean {
  const abs = path.join(CONTENT_DIR, resolvedMd);
  if (fs.existsSync(abs)) return true;
  const dir = path.dirname(abs);
  if (!fs.existsSync(dir)) return false;
  const stem = path
    .basename(resolvedMd)
    .replace(/\.zh-Hans\.md$/i, "")
    .replace(/\.en\.md$/i, "")
    .replace(/\.md$/i, "");
  return fs.readdirSync(dir).some((name) => {
    if (!name.endsWith(".md")) return false;
    const n = name
      .replace(/\.zh-Hans\.md$/i, "")
      .replace(/\.en\.md$/i, "")
      .replace(/\.md$/i, "");
    return n === stem;
  });
}

export function rewriteDocLinks(
  markdown: string,
  currentRelFile: string,
  locale: Locale
): string {
  const currentDir = path.posix.dirname(currentRelFile.replace(/\\/g, "/"));

  return markdown.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    (full, text: string, url: string) => {
      const trimmed = url.trim();
      if (
        /^(https?:|mailto:|tel:|#)/i.test(trimmed) ||
        trimmed.startsWith("data:")
      ) {
        return full;
      }

      const [rawPath, hash = ""] = trimmed.split("#");
      if (!rawPath) return full;

      let resolved = rawPath;
      if (!rawPath.startsWith("/")) {
        resolved = path.posix.normalize(
          path.posix.join(currentDir === "." ? "" : currentDir, rawPath)
        );
      } else {
        resolved = rawPath.replace(/^\//, "");
      }

      if (resolved.startsWith("../")) {
        const absish = path.posix.normalize(
          path.posix.join(currentDir, rawPath)
        );
        resolved = absish.replace(/^(\.\.\/)+/, "");
      }

      // Cross-locale markdown → upstream GitHub
      if (
        (locale === "zh-Hans" && /\.en\.md$/i.test(rawPath)) ||
        (locale === "en" && /\.zh-Hans\.md$/i.test(rawPath)) ||
        (locale !== "zh-TW" &&
          rawPath.endsWith(".md") &&
          !/\.zh-Hans\.md$/i.test(rawPath) &&
          !/\.en\.md$/i.test(rawPath) &&
          !/README\.md$/i.test(rawPath) &&
          locale === "zh-Hans")
      ) {
        // Keep sibling locale switchers pointing upstream
        if (/\.en\.md$/i.test(rawPath) || (locale === "en" && /\.zh-Hans\.md$/i.test(rawPath))) {
          const upstream = `${UPSTREAM_BLOB}${resolved}`;
          return `[${text}](${upstream}${hash ? `#${hash}` : ""})`;
        }
      }

      if (/\.md$/i.test(resolved)) {
        if (contentHasMarkdown(resolved)) {
          const slug = fileToSlug(resolved).join("/");
          return `[${text}](${localePath(locale, `/docs/${slug}`)}${hash ? `#${hash}` : ""})`;
        }
        // Not in local content snapshot → upstream
        return `[${text}](${UPSTREAM_BLOB}${resolved}${hash ? `#${hash}` : ""})`;
      }

      // Directory links (e.g. ../03-react-from-scratch/) → README doc page
      const asDir = resolved.replace(/\/$/, "");
      const baseName = path.posix.basename(asDir);
      if (asDir && !/\.[a-z0-9]+$/i.test(baseName)) {
        const absDir = path.join(CONTENT_DIR, asDir);
        if (fs.existsSync(absDir) && fs.statSync(absDir).isDirectory()) {
          if (contentHasMarkdown(`${asDir}/README.md`)) {
            const slug = fileToSlug(`${asDir}/README.md`).join("/");
            return `[${text}](${localePath(locale, `/docs/${slug}`)}${hash ? `#${hash}` : ""})`;
          }
          return `[${text}](${UPSTREAM_TREE}${asDir}${hash ? `#${hash}` : ""})`;
        }
      }

      if (/\.(png|jpe?g|gif|svg|webp)$/i.test(resolved)) {
        const cdn = `https://cdn.jsdelivr.net/gh/WenyuChiou/awesome-agentic-ai-zh@main/${resolved}`;
        return `[${text}](${cdn})`;
      }

      // Code / other files not shipped in content/ → upstream GitHub
      if (/\.[a-z0-9]+$/i.test(path.posix.basename(resolved))) {
        return `[${text}](${UPSTREAM_BLOB}${resolved}${hash ? `#${hash}` : ""})`;
      }

      return full;
    }
  );
}

function logicalKey(rel: string): string {
  return fileToSlug(rel).join("/");
}

/** Docs available for a locale (one file per logical slug). */
export function getAllDocs(locale: Locale): DocMeta[] {
  const files = walkMarkdownFiles(CONTENT_DIR);
  const preferred = new Map<string, string>();

  const rank = (rel: string): number => {
    const loc = localeOfFile(rel);
    if (locale === "en") {
      if (loc === "en") return 0;
      if (loc === "zh-TW") return 1;
      return 2;
    }
    if (locale === "zh-TW") {
      if (loc === "zh-TW") return 0;
      if (loc === "zh-Hans") return 1;
      return 2;
    }
    if (loc === "zh-Hans") return 0;
    if (loc === "zh-TW") return 1;
    return 2;
  };

  for (const rel of files) {
    const key = logicalKey(rel);
    const prev = preferred.get(key);
    if (!prev || rank(rel) < rank(prev)) preferred.set(key, rel);
  }

  return [...preferred.entries()]
    .map(([, rel]) => parseMarkdownFile(path.join(CONTENT_DIR, rel), rel, locale))
    .sort((a, b) => a.filePath.localeCompare(b.filePath));
}

export function getDoc(slug: string[], locale: Locale): DocMeta | undefined {
  for (const candidate of slugToCandidates(slug, locale)) {
    const full = path.join(CONTENT_DIR, candidate);
    if (fs.existsSync(full) && fs.statSync(full).isFile()) {
      const rel = candidate.replace(/\\/g, "/");
      const doc = parseMarkdownFile(full, rel, locale);
      return { ...doc, slug };
    }
  }
  return getAllDocs(locale).find((d) => d.slug.join("/") === slug.join("/"));
}

export function getDocNav(slug: string[], locale: Locale) {
  const docs = getAllDocs(locale).filter((d) => {
    return (
      d.filePath.startsWith("stages/") ||
      d.filePath.startsWith("tracks/") ||
      d.filePath.startsWith("resources/") ||
      d.filePath.startsWith("branches/") ||
      d.filePath.startsWith("walkthroughs/") ||
      d.filePath.startsWith("examples/")
    );
  });
  const key = slug.join("/");
  const idx = docs.findIndex((d) => d.slug.join("/") === key);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? docs[idx - 1] : null,
    next: idx < docs.length - 1 ? docs[idx + 1] : null,
  };
}
