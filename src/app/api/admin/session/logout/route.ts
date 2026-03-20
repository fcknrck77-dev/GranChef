import { NextResponse } from 'next/server';
import { clearAdminSession } from '@/lib/adminSession';

export const dynamic = 'force-dynamic';

export async function POST() {
  await clearAdminSession();
  return NextResponse.json({ ok: true });
}
