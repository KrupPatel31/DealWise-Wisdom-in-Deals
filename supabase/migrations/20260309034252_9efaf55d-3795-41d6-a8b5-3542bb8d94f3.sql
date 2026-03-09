
-- Drop and recreate the my_referrals view with security_invoker and row filter
DROP VIEW IF EXISTS public.my_referrals;

CREATE VIEW public.my_referrals
WITH (security_invoker = true)
AS
SELECT id, referrer_id, coins_awarded, created_at, referral_code, status
FROM public.referrals
WHERE referrer_id = auth.uid();
