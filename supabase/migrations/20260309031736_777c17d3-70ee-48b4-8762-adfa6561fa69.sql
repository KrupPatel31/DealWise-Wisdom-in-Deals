
DROP VIEW IF EXISTS public.my_referrals;
CREATE VIEW public.my_referrals WITH (security_invoker = true) AS
SELECT id, referrer_id, coins_awarded, created_at, status, referral_code
FROM public.referrals
WHERE referrer_id = auth.uid();
