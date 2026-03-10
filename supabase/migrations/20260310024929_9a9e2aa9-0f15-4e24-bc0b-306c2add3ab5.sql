
-- 1. deal_coins: Deny all writes from client (server-only via edge functions)
CREATE POLICY "Deny client insert on deal_coins"
ON public.deal_coins FOR INSERT TO authenticated
WITH CHECK (false);

CREATE POLICY "Deny client update on deal_coins"
ON public.deal_coins FOR UPDATE TO authenticated
USING (false) WITH CHECK (false);

CREATE POLICY "Deny client delete on deal_coins"
ON public.deal_coins FOR DELETE TO authenticated
USING (false);

-- 2. deal_coins_transactions: Deny all writes (already no permissive, add explicit deny)
CREATE POLICY "Deny client insert on deal_coins_transactions"
ON public.deal_coins_transactions FOR INSERT TO authenticated
WITH CHECK (false);

CREATE POLICY "Deny client delete on deal_coins_transactions"
ON public.deal_coins_transactions FOR DELETE TO authenticated
USING (false);

CREATE POLICY "Deny client update on deal_coins_transactions"
ON public.deal_coins_transactions FOR UPDATE TO authenticated
USING (false) WITH CHECK (false);

-- 3. orders: Deny client insert and update (server-only via validate-order)
CREATE POLICY "Deny client insert on orders"
ON public.orders FOR INSERT TO authenticated
WITH CHECK (false);

CREATE POLICY "Deny client update on orders"
ON public.orders FOR UPDATE TO authenticated
USING (false) WITH CHECK (false);

-- 4. referrals: Deny all writes (server-only)
CREATE POLICY "Deny client insert on referrals"
ON public.referrals FOR INSERT TO authenticated
WITH CHECK (false);

CREATE POLICY "Deny client update on referrals"
ON public.referrals FOR UPDATE TO authenticated
USING (false) WITH CHECK (false);

CREATE POLICY "Deny client delete on referrals"
ON public.referrals FOR DELETE TO authenticated
USING (false);

-- 5. daily_login_claims: Deny all writes (server-only via earn-coins)
CREATE POLICY "Deny client insert on daily_login_claims"
ON public.daily_login_claims FOR INSERT TO authenticated
WITH CHECK (false);

CREATE POLICY "Deny client update on daily_login_claims"
ON public.daily_login_claims FOR UPDATE TO authenticated
USING (false) WITH CHECK (false);

CREATE POLICY "Deny client delete on daily_login_claims"
ON public.daily_login_claims FOR DELETE TO authenticated
USING (false);

-- 6. product_reviews: Deny all writes (server-only via earn-coins)
CREATE POLICY "Deny client insert on product_reviews"
ON public.product_reviews FOR INSERT TO authenticated
WITH CHECK (false);

CREATE POLICY "Deny client update on product_reviews"
ON public.product_reviews FOR UPDATE TO authenticated
USING (false) WITH CHECK (false);

CREATE POLICY "Deny client delete on product_reviews"
ON public.product_reviews FOR DELETE TO authenticated
USING (false);

-- 7. referral_codes: Deny all writes (server-only)
CREATE POLICY "Deny client insert on referral_codes"
ON public.referral_codes FOR INSERT TO authenticated
WITH CHECK (false);

CREATE POLICY "Deny client update on referral_codes"
ON public.referral_codes FOR UPDATE TO authenticated
USING (false) WITH CHECK (false);

CREATE POLICY "Deny client delete on referral_codes"
ON public.referral_codes FOR DELETE TO authenticated
USING (false);
