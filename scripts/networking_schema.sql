-- GrandChef Networking Shard Schema

-- 1. Profiles for Companies
CREATE TABLE IF NOT EXISTS company_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    business_name TEXT NOT NULL,
    vat_number TEXT UNIQUE NOT NULL, -- CIF
    sector TEXT,
    address TEXT,
    city TEXT,
    website TEXT,
    description TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    logo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Job Postings
CREATE TABLE IF NOT EXISTS job_postings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES company_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT[],
    benefits TEXT[],
    salary_range TEXT,
    location TEXT,
    type TEXT DEFAULT 'Full-time', -- Full-time, Part-time, Internship
    status TEXT DEFAULT 'active', -- active, closed
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);

-- 3. Job Applications
CREATE TABLE IF NOT EXISTS job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    posting_id UUID REFERENCES job_postings(id) ON DELETE CASCADE,
    user_id UUID NOT NULL, -- References CORE users
    cv_url TEXT,
    cover_letter TEXT,
    status TEXT DEFAULT 'pending', -- pending, reviewed, rejected, accepted
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. User Awards (Prizes from Admin)
CREATE TABLE IF NOT EXISTS user_awards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    award_name TEXT NOT NULL,
    description TEXT,
    icon_url TEXT,
    issued_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Encrypted Messaging
CREATE TABLE IF NOT EXISTS messages_encrypted (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL,
    receiver_id UUID NOT NULL,
    encrypted_payload TEXT NOT NULL, -- Base64 or Hex encrypted string
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_postings_company ON job_postings(company_id);
CREATE INDEX IF NOT EXISTS idx_apps_user ON job_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_apps_posting ON job_applications(posting_id);
CREATE INDEX IF NOT EXISTS idx_msgs_sender ON messages_encrypted(sender_id);
CREATE INDEX IF NOT EXISTS idx_msgs_receiver ON messages_encrypted(receiver_id);
