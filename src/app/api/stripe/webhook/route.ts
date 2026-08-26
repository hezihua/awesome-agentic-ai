import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "缺少 STRIPE_WEBHOOK_SECRET" }, { status: 500 });
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "缺少签名" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "签名校验失败";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId =
      session.metadata?.supabase_user_id || session.client_reference_id;
    if (userId && session.payment_status === "paid") {
      const admin = createServiceClient();
      const { data: existing } = await admin.auth.admin.getUserById(userId);
      await admin.auth.admin.updateUserById(userId, {
        app_metadata: {
          ...(existing?.user?.app_metadata ?? {}),
          paid: true,
          stripe_customer_id: session.customer,
          stripe_session_id: session.id,
        },
      });
    }
  }

  return NextResponse.json({ received: true });
}
