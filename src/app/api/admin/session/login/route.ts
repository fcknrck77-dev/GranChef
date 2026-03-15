import { NextResponse } from 'next/server';
import { setAdminSession } from '@/lib/adminSession';

export async function POST(req: Request) {
  const body = await req.json().catch(() => null) as { username?: string; password?: string } | null;
  const username = body?.username || '';
  const password = body?.password || '';

  const expectedUser = process.env.ADMIN_USER || '';
  const expectedPass = process.env.ADMIN_PASS || '';

  if (!expectedUser || !expectedPass) {
    return NextResponse.json({ error: 'Admin server credentials not configured' }, { status: 500 });
  }

  if (username !== expectedUser || password !== expectedPass) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  await setAdminSession(username);
  return NextResponse.json({ ok: true });
}
