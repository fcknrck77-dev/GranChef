-- ==========================================
-- MASTER SQL PARA GRANDCHEF (TODO EN UNO)
-- ==========================================

-- 1. LIMPIEZA TOTAL (Evita errores de tipos de datos previos)
DROP TABLE IF EXISTS public.courses CASCADE;

-- 2. EXTENSIONES (Para generar IDs automáticos)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 3. CREACIÓN DE TABLA ACTUALIZADA
CREATE TABLE public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    instructor TEXT DEFAULT 'Grand Chef',
    category TEXT DEFAULT 'Técnicas',
    tier TEXT NOT NULL CHECK (tier IN ('FREE', 'PRO', 'PREMIUM')), 
    days_required INTEGER NOT NULL DEFAULT 1,
    reading_time TEXT DEFAULT '',
    modules JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3.1 TABLA DE ÓRDENES PARA LA IA
CREATE TABLE public.ai_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instruction TEXT NOT NULL,
    days_to_generate INTEGER DEFAULT 7,
    status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed'
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. SEGURIDAD (RLS)
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir lectura pública" ON public.courses FOR SELECT USING (true);

ALTER TABLE public.ai_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin full access requests" ON public.ai_requests USING (true);

-- 5. SEMILLAS (CONTENIDO PROFESIONAL DÍA 1)
INSERT INTO public.courses (title, description, instructor, category, tier, days_required, reading_time, modules)
VALUES 
(
    'Introducción a la Esferificación Básica', 
    'Aprende los conceptos fundamentales de la cocina molecular con la técnica que lo cambió todo.', 
    'Chef Ferran Adrià', 
    'Técnicas', 
    'FREE', 
    1, 
    '15 min', 
    '[{"id": 1, "title": "Bases de la Esferificación Directa", "content": "La esferificación consiste en la gelificación controlada de un líquido... requiere Alginato de Sodio y Cloruro de Calcio."}]'
),
(
    'Soportes Estructurales y Gelificación Avanzada', 
    'Dominio de hidrocoloides y texturizantes para crear estructuras imposibles.', 
    'Chef Joan Roca', 
    'Técnicas', 
    'PRO', 
    1, 
    '30 min', 
    '[
        {"id": 1, "title": "Termorreversibilidad del Agar-Agar", "content": "El Agar-Agar permite crear geles que soportan hasta 85-90ºC..."},
        {"id": 2, "title": "Sifonados y Espumas Estables", "content": "Uso de la Lecitina de Soja y Proespuma para texturas etéreas."}
    ]'
),
(
    'Arquitectura del Sabor: Cromatografía Gastronómica', 
    'MasterClass sobre la composición química de los aromas y su maridaje molecular.', 
    'Chef François Chartier', 
    'Creatividad', 
    'PREMIUM', 
    1, 
    '60 min', 
    '[
        {"id": 1, "title": "La Ciencia de las Moléculas Aromáticas", "content": "Entender los terpenos y pirazinas para crear maridajes perfectos..."},
        {"id": 2, "title": "Cromatografía en el Plato", "content": "Cómo visualizar el sabor a través de las familias moleculares."},
        {"id": 3, "title": "Estudio del Sotolón y Umami", "content": "Profundización en ingredientes de alta complejidad química."},
        {"id": 4, "title": "Diseño de Menú Basado en Ciencia", "content": "Metodología para la creación de platos disruptivos."}
    ]'
);

-- 6. ÍNDICES DE RENDIMIENTO
CREATE INDEX idx_courses_tier ON public.courses(tier);
CREATE INDEX idx_courses_days ON public.courses(days_required);

-- 7. RECIPES (contenido editable post-build)
DROP TABLE IF EXISTS public.recipes CASCADE;
CREATE TABLE IF NOT EXISTS public.recipes (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    source TEXT NOT NULL DEFAULT 'Grand Chef',
    tier TEXT NOT NULL CHECK (tier IN ('FREE', 'PRO', 'PREMIUM')),
    difficulty TEXT NOT NULL DEFAULT 'Basico' CHECK (difficulty IN ('Basico', 'Intermedio', 'Avanzado', 'Maestro')),
    servings INTEGER NOT NULL DEFAULT 2,
    times JSONB NOT NULL DEFAULT '{"prepMin":10,"cookMin":10}'::jsonb,
    description TEXT NOT NULL DEFAULT '',
    utensils JSONB NOT NULL DEFAULT '[]'::jsonb,
    ingredients JSONB NOT NULL DEFAULT '[]'::jsonb,
    steps JSONB NOT NULL DEFAULT '[]'::jsonb,
    techniques JSONB NOT NULL DEFAULT '[]'::jsonb,
    tags JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read recipes" ON public.recipes;
CREATE POLICY "Public read recipes" ON public.recipes FOR SELECT USING (true);
