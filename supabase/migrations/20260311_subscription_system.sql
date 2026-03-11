-- Subscription System Migration
-- Adds plan tiers, trial tracking, and PDF export tracking

-- 1. Extend subscriptions table with plan and trial fields
ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS plan_id text NOT NULL DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS trial_started_at timestamptz,
  ADD COLUMN IF NOT EXISTS trial_ends_at timestamptz,
  ADD COLUMN IF NOT EXISTS trial_status text NOT NULL DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS stripe_price_id text;

-- Add check constraint for plan_id
ALTER TABLE subscriptions
  DROP CONSTRAINT IF EXISTS subscriptions_plan_id_check;
ALTER TABLE subscriptions
  ADD CONSTRAINT subscriptions_plan_id_check
  CHECK (plan_id IN ('free', 'starter', 'pro'));

-- 2. Create pdf_exports table to track unique PDF exports per estimate
CREATE TABLE IF NOT EXISTS pdf_exports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, project_id)
);

-- RLS policies for pdf_exports
ALTER TABLE pdf_exports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own exports" ON pdf_exports;
CREATE POLICY "Users can view own exports" ON pdf_exports
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own exports" ON pdf_exports;
CREATE POLICY "Users can insert own exports" ON pdf_exports
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3. Initialize subscription rows for existing users who don't have one
INSERT INTO subscriptions (user_id, status, plan_id)
SELECT u.id, 'inactive', 'free'
FROM auth.users u
LEFT JOIN subscriptions s ON s.user_id = u.id
WHERE s.id IS NULL;

-- 4. Create trigger to auto-create subscription for new signups
CREATE OR REPLACE FUNCTION create_default_subscription()
RETURNS trigger AS $$
BEGIN
  INSERT INTO subscriptions (user_id, status, plan_id)
  VALUES (
    NEW.id,
    'inactive',
    'free'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_user_created_subscription ON auth.users;
CREATE TRIGGER on_user_created_subscription
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_default_subscription();
