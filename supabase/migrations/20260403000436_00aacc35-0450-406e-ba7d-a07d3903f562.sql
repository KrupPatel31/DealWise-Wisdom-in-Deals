-- Fix 1: Recreate my_referrals view as SECURITY INVOKER so it inherits RLS from referrals table
DROP VIEW IF EXISTS public.my_referrals;
CREATE VIEW public.my_referrals
  WITH (security_invoker = true)
  AS SELECT id, referrer_id, referral_code, coins_awarded, created_at, status
     FROM public.referrals;