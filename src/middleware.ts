import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n";
import {
  hasPaidAccess,
  isPaymentRequired,
  isStripeConfigured,
} from "@/lib/stripe";
import { updateSession } from "@/lib/supabase/middleware";

/** Local `next dev` — no login / paywall. Production still requires auth. */
function isDevOpenAccess() {
  return process.env.NODE_ENV === "development";
}

/** Public: locale home + login (+ pricing). */
function isPublicPath(pathname: string): boolean {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return true;
  if (!isLocale(parts[0])) return false;
  if (parts.length === 1) return true;
  if (parts.length === 2 && (parts[1] === "login" || parts[1] === "pricing")) {
    return true;
  }
  return false;
}

function needsPaidAccess(pathname: string): boolean {
  if (isDevOpenAccess()) return false;
  // Paywall off by default; enable with PAYMENT_REQUIRED=true
  if (!isPaymentRequired() || !isStripeConfigured()) return false;
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length < 2 || !isLocale(parts[0])) return false;
  return !isPublicPath(pathname);
}

function copyCookies(from: NextResponse, to: NextResponse) {
  from.cookies.getAll().forEach((cookie) => {
    to.cookies.set(cookie.name, cookie.value);
  });
  return to;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/auth") ||
    pathname.includes(".")
  ) {
    const { response } = await updateSession(request);
    return response;
  }

  const { response, user } = await updateSession(request);

  // Supabase 有时把 OAuth code 打到 Site URL（如 / 或 /zh-Hans），需转到 callback 换 session
  const authCode = request.nextUrl.searchParams.get("code");
  if (authCode) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/callback";
    return copyCookies(response, NextResponse.redirect(url));
  }

  const first = pathname.split("/").filter(Boolean)[0];
  if (!(first && isLocale(first))) {
    const url = request.nextUrl.clone();
    url.pathname =
      pathname === "/" ? `/${DEFAULT_LOCALE}` : `/${DEFAULT_LOCALE}${pathname}`;
    return copyCookies(response, NextResponse.redirect(url));
  }

  const locale = first;

  // Dev: open all content without login
  if (isDevOpenAccess()) {
    return response;
  }

  if (pathname === `/${locale}/pricing` && !user) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/login`;
    url.searchParams.set("next", pathname);
    return copyCookies(response, NextResponse.redirect(url));
  }

  if (!isPublicPath(pathname) && !user) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/login`;
    url.searchParams.set("next", pathname);
    return copyCookies(response, NextResponse.redirect(url));
  }

  if (needsPaidAccess(pathname) && user && !hasPaidAccess(user)) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/pricing`;
    url.searchParams.set("next", pathname);
    return copyCookies(response, NextResponse.redirect(url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
