"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LOCALES,
  LOCALE_LABELS,
  type Locale,
  swapLocalePath,
} from "@/lib/i18n";

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname() || `/${locale}`;

  return (
    <div className="flex items-center gap-0.5 rounded-lg border border-[var(--line)] p-0.5">
      {LOCALES.map((item) => {
        const active = item === locale;
        return (
          <Link
            key={item}
            href={swapLocalePath(pathname, item)}
            className={`rounded-md px-2 py-1 text-xs font-medium transition ${
              active
                ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                : "text-[var(--muted)] hover:text-[var(--fg)]"
            }`}
            hrefLang={item}
          >
            {LOCALE_LABELS[item]}
          </Link>
        );
      })}
    </div>
  );
}
