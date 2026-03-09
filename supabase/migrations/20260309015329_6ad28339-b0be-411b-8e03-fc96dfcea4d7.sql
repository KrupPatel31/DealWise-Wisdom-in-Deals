-- Drop the insecure view and recreate with security_invoker
DROP VIEW IF EXISTS public.my_referrals;

CREATE VIEW public.my_referrals
WITH (security_invoker = true)
AS
SELECT
  id,
  referrer_id,
  referral_code,
  coins_awarded,
  status,
  created_at
FROM public.referrals;