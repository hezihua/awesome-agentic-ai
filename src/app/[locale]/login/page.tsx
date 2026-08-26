import { notFound } from "next/navigation";
import { LoginForm } from "@/components/LoginForm";
import { getLocalePack } from "@/lib/atlas";
import { isLocale, localePath, type Locale } from "@/lib/i18n";

function isConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url && key && !url.includes("your-project"));
}

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ next?: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const { ui } = getLocalePack(locale);
  const { next: nextRaw } = await searchParams;
  const next =
    nextRaw && nextRaw.startsWith(`/${locale}`)
      ? nextRaw
      : localePath(locale);

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-6xl items-center px-5 py-24 sm:px-8">
      <LoginForm
        locale={locale}
        next={next}
        configured={isConfigured()}
        copy={{
          title: ui.authTitle,
          lead: ui.authLead,
          email: ui.authEmail,
          password: ui.authPassword,
          signIn: ui.authSignIn,
          signUp: ui.authSignUp,
          switchToSignUp: ui.authSwitchToSignUp,
          switchToSignIn: ui.authSwitchToSignIn,
          magicLink: ui.authMagicLink,
          magicSent: ui.authMagicSent,
          github: ui.authGithub,
          back: ui.authBack,
          errorGeneric: ui.authError,
          missingConfig: ui.authMissingConfig,
        }}
      />
    </main>
  );
}
