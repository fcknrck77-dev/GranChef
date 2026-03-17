import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { requireSupabaseAdmin } from '@/app/api/admin/_utils';

type Body = {
  tier: 'FREE' | 'PRO' | 'PREMIUM';
  billing?: 'monthly' | 'annual';
  email?: string;
  name?: string;
  successUrl?: string;
  cancelUrl?: string;
};

const CURRENCY = 'eur';

function priceCents(tier: Body['tier'], billing: 'monthly' | 'annual') {
  if (tier === 'PRO') return billing === 'annual' ? 19300 : 1900;
  if (tier === 'PREMIUM') return billing === 'annual' ? 47000 : 4900;
  return 0;
}

export async function POST(req: Request) {
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecret) return NextResponse.json({ error: 'stripe_not_configured' }, { status: 500 });

  const body = (await req.json().catch(() => null)) as Body | null;
  if (!body || !body.tier) return NextResponse.json({ error: 'bad_request' }, { status: 400 });

  const billing = body.billing === 'annual' ? 'annual' : 'monthly';
  if (body.tier === 'FREE') return NextResponse.json({ error: 'free_plan_no_checkout' }, { status: 400 });

  const stripe = new Stripe(stripeSecret, { apiVersion: '2023-10-16' });
  const amount = priceCents(body.tier, billing);
  if (amount <= 0) return NextResponse.json({ error: 'invalid_amount' }, { status: 400 });

  const successUrl = body.successUrl || `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout?status=success`;
  const cancelUrl = body.cancelUrl || `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout?status=cancel`;

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer_email: body.email,
    metadata: {
      tier: body.tier,
      billing,
      name: body.name || '',
    },
    line_items: [
      {
        price_data: {
          currency: CURRENCY,
          product_data: { name: `${body.tier} ${billing}` },
          recurring: { interval: billing === 'annual' ? 'year' : 'month' },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  return NextResponse.json({ url: session.url });
}
