import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { getLocalePack } from "@/lib/atlas";
import {
  LOCALES,
  LOCALE_HTML_LANG,
  isLocale,
  type Locale,
} from "@/lib/i18n";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const pack = getLocalePack(raw);
  return {
    title: `${pack.site.name} — ${pack.site.tagline}`,
    description: pack.site.description,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

  return (
    <div lang={LOCALE_HTML_LANG[locale]}>
      <SiteHeader locale={locale} />
      {children}
    </div>
  );
}
