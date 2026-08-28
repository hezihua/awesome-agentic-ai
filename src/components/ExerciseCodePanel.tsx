import { exerciseUpstreamUrl, type ExerciseFile } from "@/lib/exercise-files";

const labels: Record<
  string,
  { title: string; upstream: string; empty: string }
> = {
  "zh-Hans": {
    title: "练习代码",
    upstream: "在 GitHub 打开目录",
    empty: "未找到可展示的源码文件。",
  },
  "zh-TW": {
    title: "練習代碼",
    upstream: "在 GitHub 打開目錄",
    empty: "未找到可展示的原始碼檔案。",
  },
  en: {
    title: "Exercise code",
    upstream: "Open folder on GitHub",
    empty: "No source files to display.",
  },
};

export function ExerciseCodePanel({
  locale,
  docRelFile,
  files,
}: {
  locale: string;
  docRelFile: string;
  files: ExerciseFile[];
}) {
  const copy = labels[locale] ?? labels.en;
  const href = exerciseUpstreamUrl(docRelFile);

  if (files.length === 0) {
    return (
      <section className="mt-12 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-lg font-semibold text-[var(--fg)]">
            {copy.title}
          </h2>
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-[var(--accent)] hover:underline"
          >
            {copy.upstream} →
          </a>
        </div>
        <p className="mt-2 text-sm text-[var(--muted)]">{copy.empty}</p>
      </section>
    );
  }

  return (
    <section className="mt-12 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-lg font-semibold text-[var(--fg)]">
          {copy.title}
        </h2>
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-[var(--accent)] hover:underline"
        >
          {copy.upstream} →
        </a>
      </div>

      {files.map((file) => (
        <details
          key={file.name}
          className="group overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--surface)]"
          open={file.name.startsWith("starter") && !file.name.includes("anthropic")}
        >
          <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-[var(--fg)] transition-colors hover:bg-[var(--nav-hover)] [&::-webkit-details-marker]:hidden">
            <span className="mr-2 text-[var(--muted)] group-open:hidden">▸</span>
            <span className="mr-2 hidden text-[var(--muted)] group-open:inline">▾</span>
            <code className="font-mono text-[13px]">{file.name}</code>
          </summary>
          <pre className="max-h-[32rem] overflow-auto border-t border-[var(--line)] bg-[var(--bg)] p-4 text-[12.5px] leading-relaxed">
            <code className={`language-${file.language} hljs`}>{file.content}</code>
          </pre>
        </details>
      ))}
    </section>
  );
}
