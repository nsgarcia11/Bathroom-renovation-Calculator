-- Remove founders_trial plan — all users start on free with 3 PDF exports
-- Founders discount is handled via Stripe promo codes, not a plan tier

-- 1. Convert existing founders_trial users to free
UPDATE subscriptions
SET plan_id = 'free'
WHERE plan_id = 'founders_trial';

-- 2. Update plan_id constraint to remove founders_trial
ALTER TABLE subscriptions
  DROP CONSTRAINT IF EXISTS subscriptions_plan_id_check;
ALTER TABLE subscriptions
  ADD CONSTRAINT subscriptions_plan_id_check
  CHECK (plan_id IN ('free', 'starter', 'pro'));

-- 3. Update trigger to create free subscriptions for new signups
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
