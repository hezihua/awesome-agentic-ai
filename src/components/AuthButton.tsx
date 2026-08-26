"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { localePath, type Locale } from "@/lib/i18n";
import type { User } from "@supabase/supabase-js";

const configured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export function AuthButton({
  locale,
  labels,
}: {
  locale: Locale;
  labels: { login: string; logout: string };
}) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!configured) return;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function signOut() {
    if (!configured) return;
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(localePath(locale));
    router.refresh();
  }

  if (user) {
    return (
      <button
        type="button"
        onClick={signOut}
        className="rounded-lg border border-[var(--line)] px-3 py-1.5 text-sm text-[var(--muted)] transition-colors hover:border-[var(--accent-border)] hover:text-[var(--accent)]"
        title={user.email ?? undefined}
      >
        {labels.logout}
      </button>
    );
  }

  return (
    <Link
      href={localePath(locale, "/login")}
      className="rounded-lg bg-[var(--accent)] px-3 py-1.5 text-sm font-medium text-[var(--accent-fg)] transition-opacity hover:opacity-90"
    >
      {labels.login}
    </Link>
  );
}
