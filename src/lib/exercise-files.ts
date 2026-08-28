import fs from "node:fs";
import path from "node:path";

const CONTENT_DIR = path.join(process.cwd(), "content");
const UPSTREAM_API =
  "https://api.github.com/repos/WenyuChiou/awesome-agentic-ai-zh/contents";
const UPSTREAM_RAW =
  "https://raw.githubusercontent.com/WenyuChiou/awesome-agentic-ai-zh/main";

const CODE_EXT = new Set([
  ".py",
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".sh",
  ".json",
  ".toml",
  ".yml",
  ".yaml",
  ".txt",
  ".ipynb",
]);

export type ExerciseFile = {
  name: string;
  content: string;
  language: string;
};

function langOf(name: string): string {
  const ext = path.extname(name).toLowerCase();
  const map: Record<string, string> = {
    ".py": "python",
    ".ts": "typescript",
    ".tsx": "tsx",
    ".js": "javascript",
    ".jsx": "jsx",
    ".sh": "bash",
    ".json": "json",
    ".toml": "toml",
    ".yml": "yaml",
    ".yaml": "yaml",
    ".txt": "text",
    ".ipynb": "json",
  };
  return map[ext] || "text";
}

function isCodeFile(name: string): boolean {
  if (name === "requirements.txt" || name === "Makefile") return true;
  const ext = path.extname(name).toLowerCase();
  return CODE_EXT.has(ext);
}

/** Local sidecar files next to a README under content/. */
function readLocalSidecars(docRelFile: string): ExerciseFile[] {
  const dirRel = path.posix.dirname(docRelFile.replace(/\\/g, "/"));
  const absDir = path.join(CONTENT_DIR, dirRel);
  if (!fs.existsSync(absDir) || !fs.statSync(absDir).isDirectory()) return [];

  return fs
    .readdirSync(absDir)
    .filter((name) => isCodeFile(name))
    .sort()
    .map((name) => {
      const content = fs.readFileSync(path.join(absDir, name), "utf8");
      return { name, content, language: langOf(name) };
    });
}

/** Fetch exercise sources from upstream when not present locally. */
async function fetchUpstreamSidecars(
  docRelFile: string
): Promise<ExerciseFile[]> {
  const dirRel = path.posix.dirname(docRelFile.replace(/\\/g, "/"));
  if (!dirRel.startsWith("examples/")) return [];

  try {
    const res = await fetch(`${UPSTREAM_API}/${dirRel}`, {
      headers: { Accept: "application/vnd.github+json", "User-Agent": "agent-atlas" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const listing = (await res.json()) as Array<{
      name: string;
      type: string;
      download_url?: string | null;
    }>;
    if (!Array.isArray(listing)) return [];

    const files = listing
      .filter((item) => item.type === "file" && isCodeFile(item.name))
      .sort((a, b) => a.name.localeCompare(b.name));

    const out: ExerciseFile[] = [];
    for (const item of files) {
      const url = item.download_url || `${UPSTREAM_RAW}/${dirRel}/${item.name}`;
      const fileRes = await fetch(url, {
        headers: { "User-Agent": "agent-atlas" },
        next: { revalidate: 3600 },
      });
      if (!fileRes.ok) continue;
      const content = await fileRes.text();
      out.push({ name: item.name, content, language: langOf(item.name) });
    }
    return out;
  } catch {
    return [];
  }
}

/**
 * Load code files for an exercise README (local content/ first, else upstream).
 */
export async function getExerciseFiles(
  docRelFile: string
): Promise<ExerciseFile[]> {
  const normalized = docRelFile.replace(/\\/g, "/");
  if (!normalized.startsWith("examples/")) return [];
  if (!/README(\.[^/]+)?\.md$/i.test(path.posix.basename(normalized))) {
    return [];
  }

  const local = readLocalSidecars(normalized);
  if (local.length > 0) return local;
  return fetchUpstreamSidecars(normalized);
}

export function exerciseUpstreamUrl(docRelFile: string): string {
  const dirRel = path.posix.dirname(docRelFile.replace(/\\/g, "/"));
  return `https://github.com/WenyuChiou/awesome-agentic-ai-zh/tree/main/${dirRel}`;
}
