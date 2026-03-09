
-- ============================================
-- Convert ALL restrictive policies to permissive
-- ============================================

-- cart_items
DROP POLICY IF EXISTS "Users can view their own cart items" ON public.cart_items;
CREATE POLICY "Users can view their own cart items" ON public.cart_items FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own cart items" ON public.cart_items;
CREATE POLICY "Users can insert their own cart items" ON public.cart_items FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own cart items" ON public.cart_items;
CREATE POLICY "Users can update their own cart items" ON public.cart_items FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (
    (auth.uid() = user_id)
    AND (NOT (price IS DISTINCT FROM (SELECT ci.price FROM cart_items ci WHERE ci.id = cart_items.id)))
    AND (NOT (original_price IS DISTINCT FROM (SELECT ci.original_price FROM cart_items ci WHERE ci.id = cart_items.id)))
    AND (NOT (discount IS DISTINCT FROM (SELECT ci.discount FROM cart_items ci WHERE ci.id = cart_items.id)))
  );

DROP POLICY IF EXISTS "Users can delete their own cart items" ON public.cart_items;
CREATE POLICY "Users can delete their own cart items" ON public.cart_items FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- coupons
DROP POLICY IF EXISTS "Anyone can view active coupons" ON public.coupons;
CREATE POLICY "Anyone can view active coupons" ON public.coupons FOR SELECT USING (is_active = true AND expires_at > now());

-- daily_deals
DROP POLICY IF EXISTS "Anyone can view active deals" ON public.daily_deals;
CREATE POLICY "Anyone can view active deals" ON public.daily_deals FOR SELECT USING (is_active = true AND ends_at > now());

-- daily_login_claims
DROP POLICY IF EXISTS "Users can view their own claims" ON public.daily_login_claims;
CREATE POLICY "Users can view their own claims" ON public.daily_login_claims FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- deal_coins
DROP POLICY IF EXISTS "Users can view their own coin balance" ON public.deal_coins;
CREATE POLICY "Users can view their own coin balance" ON public.deal_coins FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- deal_coins_transactions
DROP POLICY IF EXISTS "Users can view their own transactions" ON public.deal_coins_transactions;
CREATE POLICY "Users can view their own transactions" ON public.deal_coins_transactions FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- orders
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own orders" ON public.orders;
CREATE POLICY "Users can delete their own orders" ON public.orders FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- password_reset_attempts
DROP POLICY IF EXISTS "Deny all client access" ON public.password_reset_attempts;
CREATE POLICY "Deny all client access" ON public.password_reset_attempts FOR ALL USING (false) WITH CHECK (false);

-- price_history
DROP POLICY IF EXISTS "Anyone can view price history" ON public.price_history;
CREATE POLICY "Anyone can view price history" ON public.price_history FOR SELECT USING (true);

-- product_reviews
DROP POLICY IF EXISTS "Users can view their own reviews" ON public.product_reviews;
CREATE POLICY "Users can view their own reviews" ON public.product_reviews FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = user_id AND is_active = true);

DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;
CREATE POLICY "Users can create their own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id AND is_active = true) WITH CHECK (auth.uid() = user_id AND is_active = true);

DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;
CREATE POLICY "Users can delete their own profile" ON public.profiles FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- referral_codes
DROP POLICY IF EXISTS "Users can view their own referral code" ON public.referral_codes;
CREATE POLICY "Users can view their own referral code" ON public.referral_codes FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- referrals
DROP POLICY IF EXISTS "Users can view their own referrals" ON public.referrals;
CREATE POLICY "Users can view their own referrals" ON public.referrals FOR SELECT TO authenticated USING (auth.uid() = referrer_id);

-- view_counter
DROP POLICY IF EXISTS "Anyone can view the counter" ON public.view_counter;
CREATE POLICY "Anyone can view the counter" ON public.view_counter FOR SELECT USING (true);
