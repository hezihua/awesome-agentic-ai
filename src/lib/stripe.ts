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

export function isStripeConfigured() {
  return Boolean(
    process.env.STRIPE_SECRET_KEY &&
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY &&
      process.env.STRIPE_PRICE_ID
  );
}

export function hasPaidAccess(user: {
  app_metadata?: Record<string, unknown>;
} | null): boolean {
  return user?.app_metadata?.paid === true;
}
