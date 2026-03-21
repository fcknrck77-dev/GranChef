import { NextResponse } from 'next/server';
import { getCulinaryKnowledge } from '@/lib/ai_service';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || '';
    
    if (!q) return NextResponse.json({ knowledge: '' });
    
    const knowledge = await getCulinaryKnowledge(q);
    return NextResponse.json({ knowledge });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
