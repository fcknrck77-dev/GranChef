import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

const DEMO_TESTS: Record<string, any> = {
  'local-free-01': {
    course_id: 'local-free-01',
    questions: [
      {
        question: "¿Cuál es el objetivo principal de crear un mapa de textura?",
        options: ["Decorar el plato", "Aprender a describir y reproducir una textura con precisión", "Aumentar el precio del menú", "Reducir el tiempo de cocción"],
        correct_index: 1
      },
      // ... rest of 20 questions
    ].concat(Array(19).fill({
      question: "Pregunta técnica adicional (Demo FREE)...",
      options: ["Opción A", "Opción B", "Opción C", "Opción D"],
      correct_index: 0
    })),
    release_answers_at: new Date(Date.now() + 96 * 60 * 60 * 1000).toISOString()
  },
  'local-pro-01': {
    course_id: 'local-pro-01',
    questions: Array(20).fill({
      question: "Pregunta técnica PRO de prueba...",
      options: ["Opción 1", "Opción 2", "Opción 3", "Opción 4"],
      correct_index: 2
    }),
    release_answers_at: new Date(Date.now() + 96 * 60 * 60 * 1000).toISOString()
  },
  'local-premium-01': {
    course_id: 'local-premium-01',
    questions: Array(20).fill({
      question: "Pregunta de alta complejidad PREMIUM...",
      options: ["Base", "Estructura", "Tensión", "Narrativa"],
      correct_index: 3
    }),
    release_answers_at: new Date(Date.now() + 96 * 60 * 60 * 1000).toISOString()
  }
};

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await params;
  const id = rawId?.toLowerCase().trim();
  const supa = getSupabaseAdmin();
  if (!supa) return NextResponse.json({ error: 'supabase_not_configured' }, { status: 503 });

  let testData: any = null;

  // UUID validation to avoid Postgres errors for local courses (non-UUID ids)
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  
  if (isUuid) {
    const { data, error } = await supa
      .from('course_tests')
      .select('*')
      .eq('course_id', id)
      .maybeSingle();
    
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    testData = data;
  } else {
    // Return demo test for hardcoded local courses
    testData = id ? DEMO_TESTS[id] : null;
  }

  if (!testData) {
    return NextResponse.json({ 
      error: 'test_not_found', 
      debug_id: id 
    }, { status: 404 });
  }

  // Calculate if answers should be visible based on release_answers_at
  const releaseDate = new Date(testData.release_answers_at);
  const now = new Date();
  const isReleased = now >= releaseDate;

  // STRIP correct_index if NOT released (Security Enforcement)
  const secureQuestions = testData.questions.map((q: any) => {
    if (isReleased) return q;
    const { correct_index, ...safeQuestion } = q;
    return safeQuestion;
  });
  
  return NextResponse.json({
    ...testData,
    questions: secureQuestions,
    isReleased,
    timeUntilRelease: isReleased ? 0 : releaseDate.getTime() - now.getTime()
  });
}
