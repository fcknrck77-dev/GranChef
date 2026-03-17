-- AI Gastronomic Engine Setup
-- Professional Evaluation System & Cycle Tracking

-- 1. Update Courses table for continuous content
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS generation_cycle_id TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS full_content TEXT;

-- 1.1 Scheduled engine jobs
CREATE TABLE IF NOT EXISTS public.engine_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kind TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'queued', -- queued, running, completed, failed, canceled
    run_at TIMESTAMPTZ NOT NULL,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    last_error TEXT,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create Course Tests table
CREATE TABLE IF NOT EXISTS public.course_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    questions JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of {question: string, options: string[], correct_index: number}
    answers_visible BOOLEAN DEFAULT FALSE,
    release_answers_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create Engine Cycles table
CREATE TABLE IF NOT EXISTS public.engine_cycles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cycle_id TEXT UNIQUE NOT NULL, -- e.g. "cycle-2026-03-17"
    status TEXT NOT NULL DEFAULT 'pending', -- pending, processing, completed, failed
    created_at TIMESTAMPTZ DEFAULT now(),
    completed_at TIMESTAMPTZ
);

-- 4. Enable RLS and Policies
ALTER TABLE public.course_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.engine_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.engine_jobs ENABLE ROW LEVEL SECURITY;

-- Public can read tests (but answers_visible controls what they see in frontend)
DROP POLICY IF EXISTS "Public read course_tests" ON public.course_tests;
CREATE POLICY "Public read course_tests" ON public.course_tests FOR SELECT USING (true);

-- Admin only for cycles
DROP POLICY IF EXISTS "Admin only engine_cycles" ON public.engine_cycles;
-- No public policies means service role only

-- Admin only for jobs
DROP POLICY IF EXISTS "Admin only engine_jobs" ON public.engine_jobs;
-- No public policies means service role only

-- 5. Indexes
CREATE INDEX IF NOT EXISTS idx_course_tests_course_id ON public.course_tests(course_id);
CREATE INDEX IF NOT EXISTS idx_engine_cycles_status ON public.engine_cycles(status);
CREATE INDEX IF NOT EXISTS idx_courses_cycle_id ON public.courses(generation_cycle_id);
CREATE INDEX IF NOT EXISTS idx_engine_jobs_status_run_at ON public.engine_jobs(status, run_at);
