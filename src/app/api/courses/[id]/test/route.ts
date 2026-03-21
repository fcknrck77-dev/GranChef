import { NextResponse } from 'next/server';
import getCoursesClient from '@/lib/supabase/courses';

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await params;
  const id = rawId?.toLowerCase().trim();
  
  if (!id) {
    return NextResponse.json({ error: 'id_missing' }, { status: 400 });
  }

  const supa = getCoursesClient();
  if (!supa) {
    return NextResponse.json({ error: 'supabase_not_configured' }, { status: 503 });
  }

  // UUID validation check
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  if (!isUuid) {
    return NextResponse.json({ error: 'invalid_identification_format' }, { status: 400 });
  }

  const { data: testData, error } = await supa
    .from('course_tests')
    .select('*')
    .eq('course_id', id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!testData) {
    return NextResponse.json({ error: 'test_not_found', debug_id: id }, { status: 404 });
  }

  // Security Logic: Strip correct_index if answers are not yet released
  const releaseDate = new Date(testData.release_answers_at);
  const now = new Date();
  const isReleased = now >= releaseDate;

  const secureQuestions = (testData.questions || []).map((q: any) => {
    if (isReleased) return q;
    const { correct_index, ...safeQuestion } = q;
    return safeQuestion;
  });

  return NextResponse.json({
    ...testData,
    questions: secureQuestions,
    isReleased,
    timeUntilRelease: isReleased ? 0 : releaseDate.getTime() - now.getTime(),
  });
}
