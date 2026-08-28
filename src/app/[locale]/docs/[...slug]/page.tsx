import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { ExerciseCodePanel } from "@/components/ExerciseCodePanel";
import TableOfContents from "@/components/TableOfContents";
import { getUi } from "@/lib/atlas";
import { getAllDocs, getDoc, getDocNav } from "@/lib/content";
import { getExerciseFiles } from "@/lib/exercise-files";
import { LOCALES, isLocale, localePath, type Locale } from "@/lib/i18n";
import { rehypeSlugify } from "@/lib/rehype-slugify";
import { extractToc } from "@/lib/toc";

export function generateStaticParams() {
  const params: { locale: string; slug: string[] }[] = [];
  for (const locale of LOCALES) {
    for (const doc of getAllDocs(locale)) {
      params.push({ locale, slug: doc.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>;
}) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) return {};
  const doc = getDoc(slug, raw);
  if (!doc) return {};
  return {
    title: `${doc.title} · Agent Atlas`,
    description: doc.description || doc.title,
  };
}

export default async function DocPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>;
}) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const doc = getDoc(slug, locale);
  if (!doc) notFound();

  const ui = getUi(locale);
  const { prev, next } = getDocNav(slug, locale);
  const toc = extractToc(doc.content);
  const exerciseFiles = await getExerciseFiles(doc.filePath);

  return (
    <div className="min-h-screen pt-14">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-5 sm:px-8 xl:grid-cols-[1fr_15rem] xl:gap-12">
        <div className="flex justify-center">
          <div className="w-full max-w-3xl py-10 sm:py-12">
            <Link
              href={localePath(locale)}
              className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
            >
              <span>←</span>
              <span>{ui.backToMap}</span>
            </Link>

            <header className="mb-10 border-b border-[var(--line)] pb-8">
              <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2">
                <span className="hud-chip">{ui.simplifiedDoc}</span>
                <span className="text-sm text-[var(--faint)]">
                  {ui.readingMin.replace("{n}", String(doc.readingTime))}
                </span>
              </div>
              <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight text-[var(--fg)] sm:text-4xl">
                {doc.title}
              </h1>
              {doc.description && (
                <p className="mt-4 text-[16px] leading-relaxed text-[var(--muted)]">
                  {doc.description}
                </p>
              )}
              <p className="mt-3 text-xs text-[var(--faint)]">{doc.filePath}</p>
            </header>

            <article className="prose-portal">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypeSlugify, rehypeHighlight]}
              >
                {doc.content}
              </ReactMarkdown>
            </article>

            <ExerciseCodePanel
              locale={locale}
              docRelFile={doc.filePath}
              files={exerciseFiles}
            />

            <nav className="mt-16 grid grid-cols-1 gap-3 border-t border-[var(--line)] pt-8 sm:grid-cols-2">
              {prev ? (
                <Link
                  href={localePath(locale, `/docs/${prev.slug.join("/")}`)}
                  className="group flex flex-col gap-1 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-5 py-4 transition hover:border-[var(--accent-border)]"
                >
                  <div className="flex items-center gap-2 text-xs text-[var(--faint)] group-hover:text-[var(--accent)]">
                    <span>←</span>
                    <span>{ui.prev}</span>
                  </div>
                  <div className="line-clamp-2 text-sm font-medium text-[var(--fg)]">
                    {prev.title}
                  </div>
                </Link>
              ) : (
                <div />
              )}
              {next ? (
                <Link
                  href={localePath(locale, `/docs/${next.slug.join("/")}`)}
                  className="group flex flex-col gap-1 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-5 py-4 transition hover:border-[var(--accent-border)] sm:items-end"
                >
                  <div className="flex items-center gap-2 text-xs text-[var(--faint)] group-hover:text-[var(--accent)]">
                    <span>{ui.next}</span>
                    <span>→</span>
                  </div>
                  <div className="line-clamp-2 text-left text-sm font-medium text-[var(--fg)] sm:text-right">
                    {next.title}
                  </div>
                </Link>
              ) : (
                <div />
              )}
            </nav>
          </div>
        </div>

        <aside className="hidden xl:block">
          <TableOfContents items={toc} title={ui.toc} />
        </aside>
      </div>
    </div>
  );
}
