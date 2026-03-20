import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { isAdminSessionValid } from '@/lib/adminSession';

export async function GET() {
  return NextResponse.json({ isAdmin: await isAdminSessionValid() });
}
