-- AI_BRAIN Shard Schema
-- Dedicated to Ingredients, Techniques, and External Culinary Knowledge

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. INGREDIENTS
CREATE TABLE IF NOT EXISTS public.ingredients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    tier TEXT DEFAULT 'FREE' CHECK (tier IN ('FREE', 'PRO', 'PREMIUM')),
    category TEXT DEFAULT 'General',
    properties JSONB NOT NULL DEFAULT '{}'::jsonb, -- taste, texture, season, origin
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. TECHNIQUES
CREATE TABLE IF NOT EXISTS public.techniques (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    tier TEXT DEFAULT 'FREE' CHECK (tier IN ('FREE', 'PRO', 'PREMIUM')),
    difficulty TEXT DEFAULT 'Basico' CHECK (difficulty IN ('Basico', 'Intermedio', 'Avanzado', 'Maestro')),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. CULINARY KNOWLEDGE (The External Library Sink)
CREATE TABLE IF NOT EXISTS public.culinary_knowledge (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pair_key TEXT UNIQUE NOT NULL,         -- e.g. "Alcachofa y ostra"
    body TEXT NOT NULL,             -- The extracted story/description
    source TEXT DEFAULT 'The Flavor Thesaurus',
    tags JSONB DEFAULT '[]'::jsonb,  -- ["alcachofa", "ostra", "vegetal", "marino"]
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. INDEXES
CREATE INDEX IF NOT EXISTS idx_ingredients_name ON public.ingredients(name);
CREATE INDEX IF NOT EXISTS idx_techniques_name ON public.techniques(name);
CREATE INDEX IF NOT EXISTS idx_knowledge_pair_key ON public.culinary_knowledge(pair_key);

-- FTS for Knowledge
ALTER TABLE public.culinary_knowledge ADD COLUMN IF NOT EXISTS fts tsvector;
CREATE INDEX IF NOT EXISTS idx_knowledge_fts ON public.culinary_knowledge USING gin(fts);

-- Trigger to update FTS
CREATE OR REPLACE FUNCTION knowledge_fts_update() RETURNS trigger AS $$
begin
  new.fts := to_tsvector('spanish', coalesce(new.pair_key,'') || ' ' || coalesce(new.body,''));
  return new;
end
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_knowledge_fts ON public.culinary_knowledge;
CREATE TRIGGER trg_knowledge_fts BEFORE INSERT OR UPDATE ON public.culinary_knowledge
FOR EACH ROW EXECUTE FUNCTION knowledge_fts_update();
