"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { localePath, type Locale } from "@/lib/i18n";

type Copy = {
  title: string;
  lead: string;
  priceHint: string;
  buy: string;
  buying: string;
  success: string;
  canceled: string;
  alreadyPaid: string;
  back: string;
  error: string;
};

export function PricingCard({
  locale,
  copy,
  paid,
  status,
}: {
  locale: Locale;
  copy: Copy;
  paid: boolean;
  status?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function checkout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(data.error || copy.error);
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError(copy.error);
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-[var(--line)] bg-[var(--bg-elevated)] p-8 shadow-sm">
      <h1 className="font-display text-2xl font-semibold text-[var(--fg)]">
        {copy.title}
      </h1>
      <p className="mt-2 text-sm text-[var(--muted)]">{copy.lead}</p>
      <p className="mt-4 text-lg font-medium text-[var(--fg)]">{copy.priceHint}</p>

      {status === "1" || status === "success" ? (
        <p className="mt-4 text-sm text-[var(--accent)]">{copy.success}</p>
      ) : null}
      {status === "canceled" ? (
        <p className="mt-4 text-sm text-[var(--muted)]">{copy.canceled}</p>
      ) : null}

      {paid ? (
        <p className="mt-6 text-sm text-[var(--accent)]">{copy.alreadyPaid}</p>
      ) : (
        <button
          type="button"
          disabled={loading}
          onClick={checkout}
          className="mt-6 w-full rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-[var(--accent-fg)] transition-opacity disabled:opacity-60"
        >
          {loading ? copy.buying : copy.buy}
        </button>
      )}

      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

      <div className="mt-6 flex gap-4">
        <Link
          href={localePath(locale)}
          className="text-sm text-[var(--muted)] hover:text-[var(--accent)]"
        >
          ← {copy.back}
        </Link>
        {paid && (
          <button
            type="button"
            className="text-sm text-[var(--accent)]"
            onClick={() => router.refresh()}
          >
            Refresh
          </button>
        )}
      </div>
    </div>
  );
}
