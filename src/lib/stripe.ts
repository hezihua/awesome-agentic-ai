import Stripe from "stripe";

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("缺少 STRIPE_SECRET_KEY");
  }
  return new Stripe(key, {
    apiVersion: "2026-07-29.dahlia",
  });
}

export function getStripePriceId() {
  const id = process.env.STRIPE_PRICE_ID?.trim();
  if (!id) {
    throw new Error("缺少 STRIPE_PRICE_ID");
  }
  return id;
}

export function isStripeConfigured() {
  return Boolean(
    process.env.STRIPE_SECRET_KEY &&
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY &&
      process.env.STRIPE_PRICE_ID?.trim()
  );
}

export function hasPaidAccess(user: {
  app_metadata?: Record<string, unknown>;
} | null): boolean {
  return user?.app_metadata?.paid === true;
}

/** Set PAYMENT_REQUIRED=true to gate docs behind Stripe again. */
export function isPaymentRequired() {
  return process.env.PAYMENT_REQUIRED === "true";
}
