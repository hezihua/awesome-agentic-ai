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
  /** Path relative to content root / upstream repo */
  path: string;
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

function readLocalDir(dirRel: string): ExerciseFile[] {
  const absDir = path.join(CONTENT_DIR, dirRel);
  if (!fs.existsSync(absDir) || !fs.statSync(absDir).isDirectory()) return [];

  return fs
    .readdirSync(absDir)
    .filter((name) => isCodeFile(name))
    .sort()
    .map((name) => {
      const content = fs.readFileSync(path.join(absDir, name), "utf8");
      return {
        name,
        path: path.posix.join(dirRel, name),
        content,
        language: langOf(name),
      };
    });
}

async function fetchUpstreamDir(dirRel: string): Promise<ExerciseFile[]> {
  try {
    const res = await fetch(`${UPSTREAM_API}/${dirRel}`, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "agent-atlas",
      },
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
      out.push({
        name: item.name,
        path: `${dirRel}/${item.name}`,
        content,
        language: langOf(item.name),
      });
    }
    return out;
  } catch {
    return [];
  }
}

async function loadDir(dirRel: string): Promise<ExerciseFile[]> {
  const local = readLocalDir(dirRel);
  if (local.length > 0) return local;
  return fetchUpstreamDir(dirRel);
}

/** Candidate exercise dirs to probe for a doc under examples/. */
function exampleDirsToTry(docRelFile: string): string[] {
  const dirRel = path.posix.dirname(docRelFile.replace(/\\/g, "/"));
  if (!dirRel.startsWith("examples/")) return [];

  const out: string[] = [];
  let d = dirRel;
  while (d.startsWith("examples/") && d !== "examples") {
    const parts = d.split("/");
    // examples/stage-3/03-foo or deeper
    if (parts.length >= 3) out.push(d);
    const parent = path.posix.dirname(d);
    if (parent === d) break;
    d = parent;
  }
  return out;
}

/** Paths like examples/stage-3/03-xxx/starter.py mentioned in markdown. */
function referencedExampleFiles(markdown: string): string[] {
  const found = new Set<string>();
  const patterns = [
    /examples\/stage-\d+\/[^\s)`"']+\.(?:py|ts|js|sh|txt|json)/gi,
    /\.\.\/examples\/stage-\d+\/[^\s)`"']+\.(?:py|ts|js|sh|txt|json)/gi,
  ];
  for (const re of patterns) {
    for (const m of markdown.matchAll(re)) {
      let p = m[0].replace(/\\/g, "/");
      if (p.startsWith("../")) {
        // resolve roughly: stages/foo + ../examples/... → examples/...
        p = p.replace(/^(\.\.\/)+/, "");
      }
      if (p.startsWith("examples/")) found.add(p);
    }
  }
  return [...found];
}

async function fetchSingleFile(relPath: string): Promise<ExerciseFile | null> {
  const localAbs = path.join(CONTENT_DIR, relPath);
  if (fs.existsSync(localAbs) && fs.statSync(localAbs).isFile()) {
    const name = path.posix.basename(relPath);
    return {
      name,
      path: relPath,
      content: fs.readFileSync(localAbs, "utf8"),
      language: langOf(name),
    };
  }
  try {
    const res = await fetch(`${UPSTREAM_RAW}/${relPath}`, {
      headers: { "User-Agent": "agent-atlas" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const name = path.posix.basename(relPath);
    return {
      name,
      path: relPath,
      content: await res.text(),
      language: langOf(name),
    };
  } catch {
    return null;
  }
}

function mergeFiles(lists: ExerciseFile[][]): ExerciseFile[] {
  const map = new Map<string, ExerciseFile>();
  for (const list of lists) {
    for (const f of list) {
      // Prefer path-unique; same basename from different dirs: keep first
      if (!map.has(f.name)) map.set(f.name, f);
    }
  }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Load code files for popup: exercise folders under examples/, plus
 * any examples/.../*.py referenced from stage docs.
 */
export async function getExerciseFiles(
  docRelFile: string,
  markdown = ""
): Promise<ExerciseFile[]> {
  const normalized = docRelFile.replace(/\\/g, "/");
  const buckets: ExerciseFile[][] = [];

  if (normalized.startsWith("examples/")) {
    for (const dir of exampleDirsToTry(normalized)) {
      const files = await loadDir(dir);
      if (files.length > 0) {
        buckets.push(files);
        break;
      }
    }
  }

  const refs = referencedExampleFiles(markdown);
  if (refs.length > 0) {
    const extras: ExerciseFile[] = [];
    // Also load whole dirs for referenced files
    const dirs = new Set(refs.map((r) => path.posix.dirname(r)));
    for (const dir of dirs) {
      const files = await loadDir(dir);
      if (files.length > 0) extras.push(...files);
    }
    for (const rel of refs) {
      if (extras.some((f) => f.path === rel)) continue;
      const one = await fetchSingleFile(rel);
      if (one) extras.push(one);
    }
    if (extras.length) buckets.push(extras);
  }

  return mergeFiles(buckets);
}

export function exerciseUpstreamUrl(docRelFile: string): string {
  const dirRel = path.posix.dirname(docRelFile.replace(/\\/g, "/"));
  return `https://github.com/WenyuChiou/awesome-agentic-ai-zh/tree/main/${dirRel}`;
}
