-- Limpiar tabla previa si existe para evitar errores de tipo de datos (UUID vs TEXT)
DROP TABLE IF EXISTS public.courses CASCADE;

-- Creación de la tabla de cursos para el sistema de Drip Content (GrandChef)
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    instructor TEXT DEFAULT 'GrandChef AI',
    category TEXT DEFAULT 'Técnicas', -- 'Técnicas', 'Ingredientes', 'Gestión', 'Creatividad'
    tier TEXT NOT NULL CHECK (tier IN ('FREE', 'PRO', 'PREMIUM')), 
    days_required INTEGER NOT NULL DEFAULT 1, -- Día de desbloqueo (1, 2, 3...)
    reading_time TEXT DEFAULT '15 min',
    modules JSONB NOT NULL DEFAULT '[]'::jsonb, -- Estructura: [{id: 1, title: '...', content: '...'}]
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Política para que cualquiera pueda leer los cursos
DROP POLICY IF EXISTS "Cursos visibles para todos" ON public.courses;
CREATE POLICY "Cursos visibles para todos" ON public.courses
    FOR SELECT USING (true);

-- Índices para velocidad
CREATE INDEX IF NOT EXISTS idx_courses_tier ON public.courses(tier);
CREATE INDEX IF NOT EXISTS idx_courses_days ON public.courses(days_required);
