
-- =====================================================
-- FIX: All RLS policies are RESTRICTIVE, causing the
-- "Deny public access" (USING false) to block ALL access
-- including authenticated users. Fix by dropping the deny
-- policies and recreating user policies as PERMISSIVE
-- (default) scoped to 'authenticated' role.
-- =====================================================

-- ============ PROFILES ============
DROP POLICY IF EXISTS "Deny public access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = user_id AND is_active = true);

CREATE POLICY "Users can create their own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profile" ON public.profiles
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ============ ORDERS ============
DROP POLICY IF EXISTS "Deny public access to orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Authenticated users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can update their own orders" ON public.orders;
DROP POLICY IF EXISTS "Authenticated users can update their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can delete their own orders" ON public.orders;

CREATE POLICY "Users can view their own orders" ON public.orders
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" ON public.orders
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders" ON public.orders
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own orders" ON public.orders
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ============ CART_ITEMS ============
DROP POLICY IF EXISTS "Deny public access to cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Users can view their own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Users can insert their own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Users can update their own cart items" ON public.cart_items;
DROP POLICY IF EXISTS "Users can delete their own cart items" ON public.cart_items;

CREATE POLICY "Users can view their own cart items" ON public.cart_items
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cart items" ON public.cart_items
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart items" ON public.cart_items
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cart items" ON public.cart_items
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ============ DEAL_COINS ============
DROP POLICY IF EXISTS "Deny public access to deal_coins" ON public.deal_coins;
DROP POLICY IF EXISTS "Users can view their own coin balance" ON public.deal_coins;
DROP POLICY IF EXISTS "Users can insert their own coin record" ON public.deal_coins;
DROP POLICY IF EXISTS "Users can update their own coin balance" ON public.deal_coins;

CREATE POLICY "Users can view their own coin balance" ON public.deal_coins
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own coin record" ON public.deal_coins
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own coin balance" ON public.deal_coins
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============ DEAL_COINS_TRANSACTIONS ============
DROP POLICY IF EXISTS "Deny public access to deal_coins_transactions" ON public.deal_coins_transactions;
DROP POLICY IF EXISTS "Users can view their own transactions" ON public.deal_coins_transactions;
DROP POLICY IF EXISTS "Users can insert their own transactions" ON public.deal_coins_transactions;

CREATE POLICY "Users can view their own transactions" ON public.deal_coins_transactions
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions" ON public.deal_coins_transactions
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- ============ PRICE_HISTORY ============
-- Fix: "Anyone can view" was also restrictive. Recreate as permissive.
DROP POLICY IF EXISTS "Anyone can view price history" ON public.price_history;
DROP POLICY IF EXISTS "No direct update to price_history" ON public.price_history;
DROP POLICY IF EXISTS "No direct delete from price_history" ON public.price_history;
DROP POLICY IF EXISTS "System can insert price history" ON public.price_history;

CREATE POLICY "Anyone can view price history" ON public.price_history
  FOR SELECT USING (true);

-- Keep insert/update/delete locked down (service_role only)
-- No policies = denied by default with RLS enabled

-- ============ VIEW_COUNTER ============
-- Fix: "Anyone can view" was also restrictive.
DROP POLICY IF EXISTS "Anyone can view the counter" ON public.view_counter;
DROP POLICY IF EXISTS "No direct insert to view_counter" ON public.view_counter;
DROP POLICY IF EXISTS "No direct update to view_counter" ON public.view_counter;
DROP POLICY IF EXISTS "No direct delete from view_counter" ON public.view_counter;

CREATE POLICY "Anyone can view the counter" ON public.view_counter
  FOR SELECT USING (true);

-- ============ DAILY_DEALS ============
DROP POLICY IF EXISTS "Anyone can view active deals" ON public.daily_deals;

CREATE POLICY "Anyone can view active deals" ON public.daily_deals
  FOR SELECT USING (is_active = true AND ends_at > now());
