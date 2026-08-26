import { notFound } from "next/navigation";
import { PricingCard } from "@/components/PricingCard";
import { getLocalePack } from "@/lib/atlas";
import { hasPaidAccess, isStripeConfigured } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { isLocale, type Locale } from "@/lib/i18n";

export default async function PricingPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ success?: string; canceled?: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const { ui } = getLocalePack(locale);
  const sp = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const status = sp.success ? "1" : sp.canceled ? "canceled" : undefined;

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-6xl items-center px-5 py-24 sm:px-8">
      {!isStripeConfigured() ? (
        <p className="text-[var(--muted)]">{ui.stripeMissingConfig}</p>
      ) : (
        <PricingCard
          locale={locale}
          paid={hasPaidAccess(user)}
          status={status}
          copy={{
            title: ui.stripeTitle,
            lead: ui.stripeLead,
            priceHint: ui.stripePriceHint,
            buy: ui.stripeBuy,
            buying: ui.stripeBuying,
            success: ui.stripeSuccess,
            canceled: ui.stripeCanceled,
            alreadyPaid: ui.stripeAlreadyPaid,
            back: ui.authBack,
            error: ui.stripeError,
          }}
        />
      )}
    </main>
  );
}
