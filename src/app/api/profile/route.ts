import { NextResponse } from 'next/server';
import getCoreClient from '@/lib/supabase/core';
import getLogsClient from '@/lib/supabase/logs';
import getCoursesClient from '@/lib/supabase/courses';
import getAiClient from '@/lib/supabase/ai';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Query app_users using the CORE Supabase client (service role key, bypasses RLS)
    const { data: user, error } = await getCoreClient()
      .from('app_users')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch stats from other shards
    const [experimentsCount, synergiesCount, coursesCount] = await Promise.all([
      getLogsClient().from('ai_requests').select('id', { count: 'exact', head: true }).eq('user_id', id),
      getAiClient().from('culinary_knowledge').select('id', { count: 'exact', head: true }), // Global synergies for now
      getCoursesClient().from('user_courses').select('id', { count: 'exact', head: true }).eq('user_id', id)
    ]);

    return NextResponse.json({ 
      user, 
      stats: {
        experiments: experimentsCount.count || 0,
        synergies: synergiesCount.count || 0,
        courses: coursesCount.count || 0,
        level: user.plan === 'PREMIUM' ? 'Master Chef' : user.plan === 'PRO' ? 'Sous Chef' : 'Aprendiz'
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const { data: user, error } = await getCoreClient()
      .from('app_users')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json({ user });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
