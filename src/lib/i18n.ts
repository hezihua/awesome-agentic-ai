export const LOCALES = ["zh-Hans", "zh-TW", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "zh-Hans";

export const LOCALE_LABELS: Record<Locale, string> = {
  "zh-Hans": "简体",
  "zh-TW": "繁中",
  en: "EN",
};

export const LOCALE_HTML_LANG: Record<Locale, string> = {
  "zh-Hans": "zh-CN",
  "zh-TW": "zh-TW",
  en: "en",
};

export const LOCALE_UPSTREAM_DOCS: Record<Locale, string> = {
  "zh-Hans": "https://wenyuchiou.github.io/awesome-agentic-ai-zh/zh-Hans/",
  "zh-TW": "https://wenyuchiou.github.io/awesome-agentic-ai-zh/",
  en: "https://wenyuchiou.github.io/awesome-agentic-ai-zh/en/",
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function localePath(locale: Locale, path = ""): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (clean === "/") return `/${locale}`;
  return `/${locale}${clean}`;
}

/** Swap locale prefix in a pathname, preserving the rest. */
export function swapLocalePath(pathname: string, next: Locale): string {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return `/${next}`;
  if (isLocale(parts[0])) {
    parts[0] = next;
    return `/${parts.join("/")}`;
  }
  return `/${next}/${parts.join("/")}`;
}
