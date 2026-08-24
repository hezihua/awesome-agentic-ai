import { notFound } from "next/navigation";
import { AtlasHome } from "@/components/AtlasHome";
import { isLocale, type Locale } from "@/lib/i18n";

export default async function LocaleHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  return (
    <main>
      <AtlasHome locale={raw as Locale} />
    </main>
  );
}
