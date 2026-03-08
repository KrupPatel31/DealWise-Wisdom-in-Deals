-- Fix 1: Restrict cart_items UPDATE to quantity-only changes (block price manipulation)
DROP POLICY IF EXISTS "Users can update their own cart items" ON public.cart_items;

CREATE POLICY "Users can update their own cart items"
ON public.cart_items FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id
  AND price IS NOT DISTINCT FROM (SELECT ci.price FROM public.cart_items ci WHERE ci.id = cart_items.id)
  AND original_price IS NOT DISTINCT FROM (SELECT ci.original_price FROM public.cart_items ci WHERE ci.id = cart_items.id)
  AND discount IS NOT DISTINCT FROM (SELECT ci.discount FROM public.cart_items ci WHERE ci.id = cart_items.id)
);

-- Fix 2: Create a safe view for referrals that hides referred_id
CREATE OR REPLACE VIEW public.my_referrals WITH (security_invoker = true) AS
SELECT id, referrer_id, referral_code, coins_awarded, status, created_at
FROM public.referrals;