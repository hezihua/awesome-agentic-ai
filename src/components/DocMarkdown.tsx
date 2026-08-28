"use client";

import { useEffect, useId, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import type { ExerciseFile } from "@/lib/exercise-files";
import { rehypeSlugify } from "@/lib/rehype-slugify";

function basename(pathOrName: string): string {
  const cleaned = pathOrName.split("#")[0].split("?")[0];
  const parts = cleaned.replace(/\\/g, "/").split("/");
  return parts[parts.length - 1] || cleaned;
}

function looksLikeCodeFile(name: string): boolean {
  return (
    /\.(py|ts|tsx|js|jsx|sh|json|toml|ya?ml|txt|ipynb)$/i.test(name) ||
    name === "requirements.txt" ||
    name === "Makefile"
  );
}

export function DocMarkdown({
  content,
  files,
  locale,
}: {
  content: string;
  files: ExerciseFile[];
  locale: string;
}) {
  const titleId = useId();
  const [active, setActive] = useState<ExerciseFile | null>(null);
  const byName = useMemo(() => {
    const map = new Map<string, ExerciseFile>();
    for (const f of files) map.set(f.name, f);
    return map;
  }, [files]);

  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [active]);

  function openFile(name: string) {
    const file = byName.get(basename(name));
    if (file) setActive(file);
  }

  const closeLabel =
    locale === "en" ? "Close" : locale === "zh-TW" ? "關閉" : "关闭";
  const githubLabel =
    locale === "en"
      ? "View on GitHub"
      : locale === "zh-TW"
        ? "在 GitHub 查看"
        : "在 GitHub 查看";

  return (
    <>
      <article className="prose-portal">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeSlugify, rehypeHighlight]}
          components={{
            code({ className, children, ...props }) {
              const text = String(children).replace(/\n$/, "");
              const isBlock =
                Boolean(className?.includes("language-")) ||
                text.includes("\n");
              if (!isBlock && looksLikeCodeFile(text) && byName.has(text)) {
                return (
                  <button
                    type="button"
                    onClick={() => openFile(text)}
                    className="cursor-pointer rounded-md bg-[var(--surface)] px-1.5 py-0.5 font-mono text-[0.9em] text-[var(--accent)] underline-offset-2 transition-colors hover:bg-[var(--nav-hover)] hover:underline"
                    title={text}
                  >
                    {text}
                  </button>
                );
              }
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
            a({ href, children, ...props }) {
              const target = href ? basename(href) : "";
              if (href && looksLikeCodeFile(target) && byName.has(target)) {
                return (
                  <button
                    type="button"
                    onClick={() => openFile(target)}
                    className="cursor-pointer font-mono text-[var(--accent)] underline-offset-2 hover:underline"
                  >
                    {children}
                  </button>
                );
              }
              return (
                <a href={href} {...props}>
                  {children}
                </a>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </article>

      {active && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 p-4 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onClick={() => setActive(null)}
        >
          <div
            className="flex max-h-[min(88vh,900px)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--bg)] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 border-b border-[var(--line)] px-4 py-3">
              <h2
                id={titleId}
                className="truncate font-mono text-sm font-semibold text-[var(--fg)]"
              >
                {active.name}
              </h2>
              <div className="flex shrink-0 items-center gap-2">
                <a
                  href={`https://github.com/WenyuChiou/awesome-agentic-ai-zh/blob/main/${active.path}`}
                  className="hidden text-xs text-[var(--muted)] hover:text-[var(--accent)] sm:inline"
                  target="_blank"
                  rel="noreferrer"
                >
                  {githubLabel}
                </a>
                <button
                  type="button"
                  onClick={() => setActive(null)}
                  className="rounded-lg border border-[var(--line)] px-2.5 py-1 text-sm text-[var(--muted)] hover:border-[var(--accent-border)] hover:text-[var(--fg)]"
                >
                  {closeLabel}
                </button>
              </div>
            </div>
            <pre className="flex-1 overflow-auto p-4 text-[12.5px] leading-relaxed">
              <code className={`language-${active.language}`}>
                {active.content}
              </code>
            </pre>
          </div>
        </div>
      )}
    </>
  );
}
