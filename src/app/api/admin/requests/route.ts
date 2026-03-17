import { NextResponse } from 'next/server';
import { requireAdmin, requireSupabaseAdmin } from '../_utils';
import { fulfillAiRequest } from '@/lib/ai_service';

type CreateBody = {
  kind?: string;
  instruction?: string;
  payload?: any;
  days_to_generate?: number;
};

export async function GET(req: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;
  const supa = requireSupabaseAdmin();
  if (!supa.ok) return supa.response;

  const url = new URL(req.url);
  const limit = Math.max(1, Math.min(100, Number(url.searchParams.get('limit') || 20)));

  const { data, error } = await supa.supabase
    .from('ai_requests')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ requests: data || [] });
}

export async function POST(req: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;
  const supa = requireSupabaseAdmin();
  if (!supa.ok) return supa.response;

  const body = (await req.json().catch(() => null)) as CreateBody | null;
  const instruction = (body?.instruction || '').trim();
  if (!instruction) return NextResponse.json({ error: 'missing_instruction' }, { status: 400 });

  const kind = (body?.kind || 'courses').trim() || 'courses';
  const payload = body?.payload && typeof body.payload === 'object' ? body.payload : {};
  const days = typeof body?.days_to_generate === 'number' ? body.days_to_generate : 7;

  const { data, error } = await supa.supabase
    .from('ai_requests')
    .insert({ kind, instruction, payload, days_to_generate: days, status: 'pending' })
    .select('*')
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // If it's a laboratory/content request, try to fulfill it immediately
  if (kind === 'ingredients' || kind === 'techniques' || kind === 'recipes') {
    try {
      // In a production environment with slow AI, we might want to do this in the background
      // but for Vercel/Next.js routes and Gemini, we can try to wait.
      await fulfillAiRequest(data.id);
    } catch (fulfillErr) {
      console.error('[Admin Request] Auto-fulfillment failed:', fulfillErr);
      // We still return 200/Insert success because the request IS saved as 'failed' in the DB
    }
  }

  return NextResponse.json({ ok: true, request: data });
}

