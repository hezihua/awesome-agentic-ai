"use client";

import { useEffect, useId, useMemo, useState, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import {
  canOpenExerciseFileRef,
  extractFileTokens,
  looksLikeCodeFileName,
  resolveExerciseFileRef,
  type ExerciseFile,
} from "@/lib/exercise-file-refs";
import { rehypeSlugify } from "@/lib/rehype-slugify";

function basename(pathOrName: string): string {
  const cleaned = pathOrName.split("#")[0].split("?")[0];
  const parts = cleaned.replace(/\\/g, "/").split("/");
  return parts[parts.length - 1] || cleaned;
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
  const [choices, setChoices] = useState<ExerciseFile[] | null>(null);

  const fileList = useMemo(() => files, [files]);

  useEffect(() => {
    if (!active && !choices) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActive(null);
        setChoices(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [active, choices]);

  function openFile(name: string) {
    const resolved = resolveExerciseFileRef(name, fileList);
    if (!resolved) return;
    if (Array.isArray(resolved)) {
      if (resolved.length === 1) {
        setChoices(null);
        setActive(resolved[0]);
      } else {
        setActive(null);
        setChoices(resolved);
      }
      return;
    }
    setChoices(null);
    setActive(resolved);
  }

  function renderInlineCode(text: string): ReactNode {
    // Exact filename
    if (looksLikeCodeFileName(text) && canOpenExerciseFileRef(text, fileList)) {
      return (
        <button
          type="button"
          onClick={() => openFile(text)}
          className="cursor-pointer rounded-md bg-[var(--surface)] px-1.5 py-0.5 font-mono text-[0.9em] text-[var(--accent)] underline decoration-[var(--accent)]/40 underline-offset-2 transition-colors hover:bg-[var(--nav-hover)] hover:decoration-[var(--accent)]"
          title={text}
        >
          {text}
        </button>
      );
    }

    // Command / mixed: `mv starter.py starter_reference.py` or `python test.py`
    const tokens = extractFileTokens(text);
    const openable = tokens.filter((t) => canOpenExerciseFileRef(t, fileList));
    if (openable.length === 0) {
      return <code>{text}</code>;
    }

    const parts: ReactNode[] = [];
    let last = 0;
    const re =
      /\b((?:[\w.-]+\.(?:py|ts|tsx|js|jsx|sh|json|toml|ya?ml|txt|ipynb))|requirements\.txt|Makefile)\b/g;
    for (const m of text.matchAll(re)) {
      const start = m.index ?? 0;
      const token = m[1];
      if (start > last) parts.push(text.slice(last, start));
      if (canOpenExerciseFileRef(token, fileList)) {
        parts.push(
          <button
            key={`${token}-${start}`}
            type="button"
            onClick={() => openFile(token)}
            className="cursor-pointer rounded-sm font-mono text-[var(--accent)] underline decoration-[var(--accent)]/40 underline-offset-2 hover:decoration-[var(--accent)]"
            title={token}
          >
            {token}
          </button>
        );
      } else {
        parts.push(token);
      }
      last = start + token.length;
    }
    if (last < text.length) parts.push(text.slice(last));

    return (
      <code className="rounded-md bg-[var(--surface)] px-1.5 py-0.5 font-mono text-[0.9em]">
        {parts}
      </code>
    );
  }

  const closeLabel =
    locale === "en" ? "Close" : locale === "zh-TW" ? "關閉" : "关闭";
  const pickLabel =
    locale === "en"
      ? "Choose a file"
      : locale === "zh-TW"
        ? "選擇檔案"
        : "选择文件";
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
              if (!isBlock) {
                return renderInlineCode(text);
              }
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
            a({ href, children, ...props }) {
              const target = href ? basename(href) : "";
              if (
                href &&
                looksLikeCodeFileName(target) &&
                canOpenExerciseFileRef(target, fileList)
              ) {
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

      {choices && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 p-4 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          onClick={() => setChoices(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-[var(--line)] bg-[var(--bg)] p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-display text-base font-semibold text-[var(--fg)]">
              {pickLabel}
            </h2>
            <ul className="mt-4 space-y-2">
              {choices.map((file) => (
                <li key={file.path}>
                  <button
                    type="button"
                    className="w-full rounded-lg border border-[var(--line)] px-3 py-2.5 text-left font-mono text-sm text-[var(--fg)] transition-colors hover:border-[var(--accent-border)] hover:text-[var(--accent)]"
                    onClick={() => {
                      setChoices(null);
                      setActive(file);
                    }}
                  >
                    {file.name}
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="mt-4 text-sm text-[var(--muted)] hover:text-[var(--fg)]"
              onClick={() => setChoices(null)}
            >
              {closeLabel}
            </button>
          </div>
        </div>
      )}

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
