"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { localePath, type Locale } from "@/lib/i18n";

type AuthCopy = {
  title: string;
  lead: string;
  email: string;
  password: string;
  signIn: string;
  signUp: string;
  switchToSignUp: string;
  switchToSignIn: string;
  magicLink: string;
  magicSent: string;
  github: string;
  back: string;
  errorGeneric: string;
  missingConfig: string;
};

export function LoginForm({
  locale,
  next,
  copy,
  configured,
}: {
  locale: Locale;
  next: string;
  copy: AuthCopy;
  configured: boolean;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(
    configured ? null : copy.missingConfig
  );
  const [loading, setLoading] = useState(false);

  const afterLogin = next || localePath(locale);
  const callbackUrl = () =>
    `${window.location.origin}/auth/callback?next=${encodeURIComponent(afterLogin)}`;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!configured) {
      setError(copy.missingConfig);
      return;
    }
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const supabase = createClient();

      if (mode === "signup") {
        const { error: err } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: callbackUrl() },
        });
        if (err) setError(err.message);
        else setMessage(copy.magicSent);
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (err) setError(err.message);
        else {
          router.push(afterLogin);
          router.refresh();
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.errorGeneric);
    }
    setLoading(false);
  }

  async function onMagicLink() {
    if (!configured) {
      setError(copy.missingConfig);
      return;
    }
    if (!email) {
      setError(copy.email);
      return;
    }
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const supabase = createClient();
      const { error: err } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: callbackUrl() },
      });
      if (err) setError(err.message);
      else setMessage(copy.magicSent);
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.errorGeneric);
    }
    setLoading(false);
  }

  async function onGithub() {
    if (!configured) {
      setError(copy.missingConfig);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error: err } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: { redirectTo: callbackUrl() },
      });
      if (err) {
        setError(err.message);
        setLoading(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.errorGeneric);
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-[var(--line)] bg-[var(--bg-elevated)] p-8 shadow-sm">
      <h1 className="font-display text-2xl font-semibold text-[var(--fg)]">
        {copy.title}
      </h1>
      <p className="mt-2 text-sm text-[var(--muted)]">{copy.lead}</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <label className="block text-sm">
          <span className="text-[var(--muted)]">{copy.email}</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-[var(--line)] bg-[var(--bg)] px-3 py-2 text-[var(--fg)] outline-none focus:border-[var(--accent)]"
          />
        </label>
        <label className="block text-sm">
          <span className="text-[var(--muted)]">{copy.password}</span>
          <input
            type="password"
            required
            minLength={6}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-[var(--line)] bg-[var(--bg)] px-3 py-2 text-[var(--fg)] outline-none focus:border-[var(--accent)]"
          />
        </label>

        {error && (
          <p className="text-sm text-red-500">{error || copy.errorGeneric}</p>
        )}
        {message && (
          <p className="text-sm text-[var(--accent)]">{message}</p>
        )}

        <button
          type="submit"
          disabled={loading || !configured}
          className="w-full rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-[var(--accent-fg)] transition-opacity disabled:opacity-60"
        >
          {mode === "signin" ? copy.signIn : copy.signUp}
        </button>
      </form>

      <div className="mt-4 flex flex-col gap-2">
        <button
          type="button"
          disabled={loading || !configured}
          onClick={onMagicLink}
          className="w-full rounded-lg border border-[var(--line)] px-4 py-2.5 text-sm text-[var(--fg)] transition-colors hover:border-[var(--accent-border)] disabled:opacity-60"
        >
          {copy.magicLink}
        </button>
        <button
          type="button"
          disabled={loading || !configured}
          onClick={onGithub}
          className="w-full rounded-lg border border-[var(--line)] px-4 py-2.5 text-sm text-[var(--fg)] transition-colors hover:border-[var(--accent-border)] disabled:opacity-60"
        >
          {copy.github}
        </button>
      </div>

      <button
        type="button"
        className="mt-4 text-sm text-[var(--muted)] hover:text-[var(--accent)]"
        onClick={() => {
          setMode(mode === "signin" ? "signup" : "signin");
          setError(null);
          setMessage(null);
        }}
      >
        {mode === "signin" ? copy.switchToSignUp : copy.switchToSignIn}
      </button>

      <div className="mt-6">
        <Link
          href={localePath(locale)}
          className="text-sm text-[var(--muted)] hover:text-[var(--accent)]"
        >
          ← {copy.back}
        </Link>
      </div>
    </div>
  );
}
