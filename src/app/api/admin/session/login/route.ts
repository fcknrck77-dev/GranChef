import { NextResponse } from 'next/server';
import { setAdminSession } from '@/lib/adminSession';

export async function POST(req: Request) {
  const body = await req.json().catch(() => null) as { username?: string; password?: string } | null;
  const username = body?.username || '';
  const password = body?.password || '';

  // Prefer server-only env vars, but allow NEXT_PUBLIC_* fallback for simple setups on Vercel.
  // Note: NEXT_PUBLIC_* are client-exposed; for real security you should use ADMIN_USER/ADMIN_PASS.
  const expectedUser = process.env.ADMIN_USER || process.env.NEXT_PUBLIC_ADMIN_USER || '';
  const expectedPass = process.env.ADMIN_PASS || process.env.NEXT_PUBLIC_ADMIN_PASS || '';

  // Preview/dev: allow admin/admin only when env credentials are not set.
  // If you have ADMIN_USER/ADMIN_PASS configured, we require them (safer even in preview).
  const allowDevDefault = process.env.NODE_ENV !== 'production' && !(expectedUser && expectedPass);
  const devOk = allowDevDefault && username === 'admin' && password === 'admin';
  const envOk = Boolean(expectedUser && expectedPass) && username === expectedUser && password === expectedPass;

  if (!envOk && !devOk) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  await setAdminSession(envOk ? username : 'admin');
  return NextResponse.json({ ok: true });
}
