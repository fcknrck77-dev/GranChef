import { NextResponse } from 'next/server';
import { requireCronSecret, requireSupabaseAdminCron } from '../_utils';
import { fulfillAiRequest } from '@/lib/ai_service';

export async function POST(req: Request) {
  const gate = requireCronSecret(req);
  if (!gate.ok) return gate.response;
  const supa = requireSupabaseAdminCron('LOGS');
  if (!supa.ok) return supa.response;

  const url = new URL(req.url);
  const limit = Math.max(1, Math.min(25, Number(url.searchParams.get('limit') || 10)));

  const { data: requests, error } = await supa.supabase
    .from('ai_requests')
    .select('id,kind,status,created_at')
    .eq('status', 'pending')
    .in('kind', ['ingredients', 'techniques', 'recipes'])
    .order('created_at', { ascending: true })
    .limit(limit);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const list = requests || [];
  if (list.length === 0) return NextResponse.json({ ok: true, processed: 0 });

  const results: any[] = [];
  for (const r of list) {
    try {
      const out = await fulfillAiRequest(String(r.id));
      results.push({ id: r.id, ok: true, out });
    } catch (e: any) {
      results.push({ id: r.id, ok: false, error: String(e?.message || e) });
    }
  }

  return NextResponse.json({ ok: true, processed: list.length, results });
}

