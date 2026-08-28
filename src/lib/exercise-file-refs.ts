/** Client-safe helpers for exercise filename aliases (no Node APIs). */

export type ExerciseFile = {
  name: string;
  /** Path relative to content root / upstream repo */
  path: string;
  content: string;
  language: string;
};

const FILE_TOKEN_RE =
  /\b((?:[\w.-]+\.(?:py|ts|tsx|js|jsx|sh|json|toml|ya?ml|txt|ipynb))|requirements\.txt|Makefile)\b/g;

export function looksLikeCodeFileName(name: string): boolean {
  return (
    /^(?:[\w.-]+\.(?:py|ts|tsx|js|jsx|sh|json|toml|ya?ml|txt|ipynb)|requirements\.txt|Makefile)$/i.test(
      name
    )
  );
}

export function extractFileTokens(text: string): string[] {
  return [...text.matchAll(FILE_TOKEN_RE)].map((m) => m[1]);
}

function basenameToken(pathOrName: string): string {
  const cleaned = pathOrName.split("#")[0].split("?")[0];
  const parts = cleaned.replace(/\\/g, "/").split("/");
  return parts[parts.length - 1] || cleaned;
}

function rankStarter(name: string): number {
  if (/good/i.test(name) && !/anthropic|crewai/i.test(name)) return 0;
  if (name === "starter.py") return 1;
  if (/^starter\.py$/i.test(name)) return 1;
  if (/good/i.test(name)) return 2;
  if (/bad/i.test(name)) return 4;
  if (/anthropic|crewai/i.test(name)) return 5;
  return 3;
}

/**
 * Map README shorthand (starter.py / starter_reference.py) to real files.
 * Returns one file, or multiple when the user should pick (e.g. bad vs good).
 */
export function resolveExerciseFileRef(
  name: string,
  files: ExerciseFile[]
): ExerciseFile | ExerciseFile[] | null {
  const key = basenameToken(name);
  const byName = new Map(files.map((f) => [f.name, f]));
  const exact = byName.get(key);
  if (exact) return exact;

  const starters = files
    .filter((f) => /^starter/i.test(f.name) && f.name.endsWith(".py"))
    .sort((a, b) => rankStarter(a.name) - rankStarter(b.name));

  // Instructional alias: "rename to starter_reference.py" → open primary starter(s)
  if (key === "starter_reference.py") {
    if (starters.length === 0) return null;
    const primary = starters.filter((f) => !/anthropic|crewai/i.test(f.name));
    const pool = primary.length ? primary : starters;
    return pool.length === 1 ? pool[0] : pool;
  }

  if (key === "starter.py") {
    if (starters.length === 0) return null;
    const primary = starters.filter((f) => !/anthropic|crewai/i.test(f.name));
    const pool = primary.length ? primary : starters;
    // Multiple variants (bad/good) → let user pick
    if (pool.length > 1) return pool;
    return pool[0];
  }

  if (key === "test.py") {
    const tests = files.filter((f) => /^test.*\.py$/i.test(f.name));
    const plain = byName.get("test.py");
    if (plain) return plain;
    const primary = tests.filter((f) => !/anthropic|crewai/i.test(f.name));
    if (primary.length === 1) return primary[0];
    if (primary.length > 1) return primary;
    return tests[0] || null;
  }

  // Unique prefix / contains match
  const prefixed = files.filter(
    (f) =>
      f.name === key ||
      f.name.startsWith(`${key}.`) ||
      f.name.startsWith(`${key}_`)
  );
  if (prefixed.length === 1) return prefixed[0];
  if (prefixed.length > 1) return prefixed;

  return null;
}

export function canOpenExerciseFileRef(
  name: string,
  files: ExerciseFile[]
): boolean {
  return resolveExerciseFileRef(name, files) !== null;
}
