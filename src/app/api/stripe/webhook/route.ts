import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { requireSupabaseAdmin } from '@/app/api/admin/_utils';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const secret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !webhookSecret) return NextResponse.json({ error: 'stripe_not_configured' }, { status: 500 });

  const stripe = new Stripe(secret, { apiVersion: '2023-10-16' });
  const body = await req.text();
  const sig = req.headers.get('stripe-signature') || '';

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    return NextResponse.json({ error: `signature_error: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const tier = (session.metadata?.tier as 'FREE' | 'PRO' | 'PREMIUM') || 'FREE';
    const billing = (session.metadata?.billing as 'monthly' | 'annual') || 'monthly';
    const email = session.customer_details?.email;
    const name = session.customer_details?.name || session.metadata?.name || 'Cliente';
    if (!email) return NextResponse.json({ ok: true, skipped: 'missing_email' });

    const supa = requireSupabaseAdmin();
    if (!supa.ok) return supa.response;

    const nextDueAt = (() => {
      const now = new Date();
      if (billing === 'annual') now.setFullYear(now.getFullYear() + 1);
      else now.setMonth(now.getMonth() + 1);
      return now.toISOString();
    })();

    await supa.supabase
      .from('app_users')
      .upsert({
        email,
        name,
        status: 'active',
        plan: tier,
        billing: { lastPaidAt: new Date().toISOString(), nextDueAt },
      }, { onConflict: 'email' });
  }

  return NextResponse.json({ received: true });
}
