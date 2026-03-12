-- ============================================
-- FULL SCHEMA SETUP FOR BATHROOM RENOVATION CALCULATOR
-- Run this on a fresh Supabase project BEFORE any other migrations.
-- ============================================

-- 1. CONTRACTORS TABLE
CREATE TABLE IF NOT EXISTS contractors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  postal_code text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  province text NOT NULL DEFAULT '',
  tax_rate numeric NOT NULL DEFAULT 0,
  hourly_rate numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'CAD',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own contractors" ON contractors;
CREATE POLICY "Users can view own contractors" ON contractors
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own contractors" ON contractors;
CREATE POLICY "Users can insert own contractors" ON contractors
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own contractors" ON contractors;
CREATE POLICY "Users can update own contractors" ON contractors
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own contractors" ON contractors;
CREATE POLICY "Users can delete own contractors" ON contractors
  FOR DELETE USING (auth.uid() = user_id);

-- 2. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contractor_id uuid NOT NULL REFERENCES contractors(id) ON DELETE CASCADE,
  client_name text NOT NULL DEFAULT '',
  client_email text,
  client_phone text,
  project_name text NOT NULL DEFAULT '',
  project_address text,
  notes text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own projects" ON projects;
CREATE POLICY "Users can view own projects" ON projects
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own projects" ON projects;
CREATE POLICY "Users can insert own projects" ON projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own projects" ON projects;
CREATE POLICY "Users can update own projects" ON projects
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own projects" ON projects;
CREATE POLICY "Users can delete own projects" ON projects
  FOR DELETE USING (auth.uid() = user_id);

-- 3. ESTIMATES TABLE
CREATE TABLE IF NOT EXISTS estimates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE UNIQUE,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  version text NOT NULL DEFAULT '1.0',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE estimates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own estimates" ON estimates;
CREATE POLICY "Users can view own estimates" ON estimates
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects WHERE projects.id = estimates.project_id AND projects.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert own estimates" ON estimates;
CREATE POLICY "Users can insert own estimates" ON estimates
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects WHERE projects.id = estimates.project_id AND projects.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update own estimates" ON estimates;
CREATE POLICY "Users can update own estimates" ON estimates
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM projects WHERE projects.id = estimates.project_id AND projects.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete own estimates" ON estimates;
CREATE POLICY "Users can delete own estimates" ON estimates
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM projects WHERE projects.id = estimates.project_id AND projects.user_id = auth.uid()
    )
  );

-- 4. SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  stripe_customer_id text,
  stripe_subscription_id text,
  stripe_price_id text,
  status text NOT NULL DEFAULT 'inactive' CHECK (status IN ('inactive', 'active', 'canceled', 'past_due')),
  plan_id text NOT NULL DEFAULT 'free' CHECK (plan_id IN ('free', 'starter', 'pro')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own subscription" ON subscriptions;
CREATE POLICY "Users can view own subscription" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own subscription" ON subscriptions;
CREATE POLICY "Users can update own subscription" ON subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- 5. PDF EXPORTS TABLE
CREATE TABLE IF NOT EXISTS pdf_exports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE pdf_exports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own exports" ON pdf_exports;
CREATE POLICY "Users can view own exports" ON pdf_exports
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own exports" ON pdf_exports;
CREATE POLICY "Users can insert own exports" ON pdf_exports
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 6. AUTO-CREATE SUBSCRIPTION TRIGGER FOR NEW SIGNUPS
-- NOTE: SET search_path = public is required because GoTrue runs as
-- supabase_auth_admin. Without it, the SECURITY DEFINER function cannot
-- resolve the subscriptions table in the trigger context.
CREATE OR REPLACE FUNCTION public.create_default_subscription()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.subscriptions (user_id, status, plan_id)
  VALUES (
    NEW.id,
    'inactive',
    'free'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

GRANT EXECUTE ON FUNCTION public.create_default_subscription() TO supabase_auth_admin;

DROP TRIGGER IF EXISTS on_user_created_subscription ON auth.users;
CREATE TRIGGER on_user_created_subscription
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_default_subscription();

-- 7. AUTO-UPDATE updated_at TRIGGER
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS contractors_updated_at ON contractors;
CREATE TRIGGER contractors_updated_at
  BEFORE UPDATE ON contractors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS projects_updated_at ON projects;
CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS estimates_updated_at ON estimates;
CREATE TRIGGER estimates_updated_at
  BEFORE UPDATE ON estimates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS subscriptions_updated_at ON subscriptions;
CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
