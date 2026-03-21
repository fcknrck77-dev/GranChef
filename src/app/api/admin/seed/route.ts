import { NextResponse } from 'next/server';
import { requireAdmin, requireSupabaseAdmin } from '../_utils';
import { generateCourseCycle } from '@/lib/gastronomic_engine';

export const dynamic = 'force-dynamic';

export async function POST() {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  try {
    console.log('[Admin Seed] Cleaning up legacy/mock data...');
    const supaCourses = requireSupabaseAdmin('COURSES');
    if (supaCourses.ok) {
      await supaCourses.supabase.from('courses').delete().ilike('instructor', '%Adria%');
      await supaCourses.supabase.from('courses').delete().ilike('instructor', '%Escoffier%');
    }

    const supaCore = requireSupabaseAdmin('CORE');
    if (supaCore.ok) {
      await supaCore.supabase.from('app_users').delete().ilike('name', '%Adria%');
      await supaCore.supabase.from('app_users').delete().ilike('name', '%Scoffier%');
      await supaCore.supabase.from('app_users').delete().ilike('name', '%Escoffier%');
    }

    console.log('[Admin Seed] Triggering manual content generation cycle...');
    const result = await generateCourseCycle();
    return NextResponse.json({ 
      ok: true, 
      message: 'Limpieza realizada y ciclo de generación completado',
      cycleId: result.cycleId 
    });
  } catch (err: any) {
    console.error('[Admin Seed] Error:', err);
    return NextResponse.json({ 
      error: err.message || 'Error en el motor gastronómico' 
    }, { status: 500 });
  }
}
