import { NextResponse } from 'next/server';
import { isAdminSessionValid } from '@/lib/adminSession';

export async function GET() {
  return NextResponse.json({ isAdmin: await isAdminSessionValid() });
}
