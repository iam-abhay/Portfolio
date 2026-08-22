-- Supabase PostgreSQL Schema for Abhay Dilip Kharat Portfolio
-- Enable Row Level Security (RLS) on all tables

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  name TEXT NOT NULL,
  headline TEXT NOT NULL,
  subtext TEXT,
  about TEXT,
  email TEXT NOT NULL,
  github TEXT,
  linkedin TEXT,
  resume_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Access for Profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Admin Insert Access for Profiles" ON public.profiles FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin Update Access for Profiles" ON public.profiles FOR UPDATE USING (auth.role() = 'authenticated');

-- 2. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  secondary_category TEXT,
  short_description TEXT NOT NULL,
  description TEXT NOT NULL,
  technologies TEXT[] DEFAULT '{}',
  github_url TEXT,
  live_url TEXT,
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  metrics TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Published Projects" ON public.projects FOR SELECT USING (published = true OR auth.role() = 'authenticated');
CREATE POLICY "Admin Write Projects" ON public.projects FOR ALL USING (auth.role() = 'authenticated');

-- 3. SKILLS TABLE
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id TEXT NOT NULL,
  category_name TEXT NOT NULL,
  skills TEXT[] DEFAULT '{}',
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Access for Skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Admin Write Access for Skills" ON public.skills FOR ALL USING (auth.role() = 'authenticated');

-- 4. EXPERIENCE TABLE
CREATE TABLE IF NOT EXISTS public.experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  location TEXT,
  start_date TEXT NOT NULL,
  end_date TEXT,
  is_current BOOLEAN DEFAULT false,
  description TEXT,
  technologies TEXT[] DEFAULT '{}',
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Access for Experience" ON public.experience FOR SELECT USING (true);
CREATE POLICY "Admin Write Access for Experience" ON public.experience FOR ALL USING (auth.role() = 'authenticated');

-- 5. EDUCATION TABLE
CREATE TABLE IF NOT EXISTS public.education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  branch TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Access for Education" ON public.education FOR SELECT USING (true);
CREATE POLICY "Admin Write Access for Education" ON public.education FOR ALL USING (auth.role() = 'authenticated');

-- 6. CERTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  issuer TEXT NOT NULL,
  date TEXT NOT NULL,
  credential_url TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Access for Certifications" ON public.certifications FOR SELECT USING (true);
CREATE POLICY "Admin Write Access for Certifications" ON public.certifications FOR ALL USING (auth.role() = 'authenticated');
