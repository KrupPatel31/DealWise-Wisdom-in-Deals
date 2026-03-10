
-- Recreate my_referrals view with security_invoker to enforce RLS
DROP VIEW IF EXISTS public.my_referrals;
CREATE VIEW public.my_referrals WITH (security_invoker = true) AS
SELECT id, referrer_id, referral_code, coins_awarded, status, created_at
FROM public.referrals
WHERE referrer_id = auth.uid();
