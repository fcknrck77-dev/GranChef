import { NextResponse } from 'next/server';
import { requireAdmin, requireSupabaseAdmin } from '../_utils';

export const dynamic = 'force-dynamic';

export async function GET() {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  const supa = requireSupabaseAdmin('CORE');
  if (!supa.ok) return supa.response;

  // We fetch users who have billing data or are not FREE
  const { data, error } = await supa.supabase
    .from('app_users')
    .select('id, name, email, plan, billing, created_at')
    .neq('plan', 'FREE')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const orders = (data || []).map((u: any) => ({
    id: u.id,
    reference: `ORD-${u.id.slice(0, 8).toUpperCase()}`,
    customerName: u.name,
    customerEmail: u.email,
    plan: u.plan,
    status: u.billing?.status || 'COMPLETED', // default to completed if they are in this list
    date: u.billing?.lastPaidAt ? new Date(u.billing.lastPaidAt).toLocaleDateString() : new Date(u.created_at).toLocaleDateString(),
    last4: u.billing?.last4 || '4242'
  }));

  return NextResponse.json({ orders });
}
