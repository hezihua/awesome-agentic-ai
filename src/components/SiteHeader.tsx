"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AuthButton } from "@/components/AuthButton";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeProvider";
import { getAtlas } from "@/lib/atlas";
import { localePath, type Locale } from "@/lib/i18n";

export function SiteHeader({ locale }: { locale: Locale }) {
  const [scrolled, setScrolled] = useState(false);
  const { site, ui, nav } = getAtlas(locale);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-[var(--line)] bg-[var(--bg-header)] backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link
          href={localePath(locale)}
          className="group flex items-center gap-2.5"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--accent)] text-[11px] font-bold text-[var(--accent-fg)]">
            A
          </span>
          <span className="font-display text-[17px] font-semibold tracking-tight text-[var(--fg)] transition-colors group-hover:text-[var(--accent)]">
            {site.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-1.5 text-sm text-[var(--muted)] transition-colors hover:bg-[var(--nav-hover)] hover:text-[var(--fg)]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher locale={locale} />
          <ThemeToggle />
          <AuthButton
            locale={locale}
            labels={{ login: ui.login, logout: ui.logout }}
          />
          <a
            href={site.upstream}
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-lg border border-[var(--line)] px-3 py-1.5 text-sm text-[var(--muted)] transition-colors hover:border-[var(--accent-border)] hover:text-[var(--accent)] sm:inline-flex"
          >
            {ui.openSource}
          </a>
        </div>
      </div>
    </header>
  );
}
