-- BUSINESS SHARD SCHEMA: grandchef_business
-- Focus: B2B Operations, Market Analytics, and Blockchain Logging

-- 1. Business Invoices (OCR Results)
CREATE TABLE IF NOT EXISTS public.business_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL, -- Links to company in NETWORKING
    vendor_name TEXT,
    invoice_date DATE,
    total_amount DECIMAL(12,2),
    items JSONB, -- List of items, prices, and categories
    raw_ocr_text TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Market Trends (Aggregated Analytics)
CREATE TABLE IF NOT EXISTS public.market_trends (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_name TEXT NOT NULL,
    category TEXT, -- e.g., 'technique', 'ingredient'
    search_volume_index INTEGER DEFAULT 0,
    growth_percentage DECIMAL(5,2),
    region TEXT DEFAULT 'Global',
    last_updated TIMESTAMPTZ DEFAULT now()
);

-- 3. Blockchain Certificate Logs
CREATE TABLE IF NOT EXISTS public.blockchain_certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    course_id UUID NOT NULL,
    certificate_hash TEXT UNIQUE NOT NULL, -- SHA-256 or Tx Hash
    blockchain_tx TEXT,
    metadata JSONB, -- {score, issue_date, validator}
    issued_at TIMESTAMPTZ DEFAULT now()
);

-- 4. User/Company Inventory (B2B Stock)
CREATE TABLE IF NOT EXISTS public.user_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL, -- User or Company ID
    item_name TEXT NOT NULL,
    quantity DECIMAL(12,2) DEFAULT 0,
    unit TEXT, -- 'kg', 'l', 'units'
    avg_unit_cost DECIMAL(12,2),
    last_restock_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Escandallos (Food Cost Calculations)
CREATE TABLE IF NOT EXISTS public.escandallos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    recipe_id TEXT, -- Optional link to internal recipe
    title TEXT NOT NULL,
    portions INTEGER DEFAULT 1,
    items JSONB NOT NULL, -- [{name, qty, unit, unit_price, waste_percentage}]
    margin_percentage DECIMAL(5,2) DEFAULT 70,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Technical Sheets (Fichas Técnicas)
CREATE TABLE IF NOT EXISTS public.technical_sheets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    recipe_id TEXT,
    title TEXT NOT NULL,
    description TEXT,
    prep_time_minutes INTEGER,
    cooking_time_minutes INTEGER,
    serving_temp TEXT,
    storage_notes TEXT,
    allergens JSONB,
    steps JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS and simple policies
ALTER TABLE public.business_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blockchain_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escandallos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technical_sheets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own escandallos" ON public.escandallos;
CREATE POLICY "Users can manage their own escandallos" ON public.escandallos USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own technical sheets" ON public.technical_sheets;
CREATE POLICY "Users can manage their own technical sheets" ON public.technical_sheets USING (auth.uid() = user_id);
