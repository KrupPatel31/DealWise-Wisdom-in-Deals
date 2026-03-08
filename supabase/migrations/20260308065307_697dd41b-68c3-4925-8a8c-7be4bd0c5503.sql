-- Fix 1: Convert all RESTRICTIVE access-granting policies to PERMISSIVE
-- Must drop and recreate since ALTER POLICY cannot change permissive/restrictive type

-- === profiles ===
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT TO authenticated USING ((auth.uid() = user_id) AND (is_active = true));

DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;
CREATE POLICY "Users can create their own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;
CREATE POLICY "Users can delete their own profile" ON public.profiles FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- === orders ===
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;
CREATE POLICY "Users can create their own orders" ON public.orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own orders" ON public.orders;
CREATE POLICY "Users can update their own orders" ON public.orders FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own orders" ON public.orders;
CREATE POLICY "Users can delete their own orders" ON public.orders FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- === cart_items ===
DROP POLICY IF EXISTS "Users can view their own cart items" ON public.cart_items;
CREATE POLICY "Users can view their own cart items" ON public.cart_items FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own cart items" ON public.cart_items;
CREATE POLICY "Users can insert their own cart items" ON public.cart_items FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own cart items" ON public.cart_items;
CREATE POLICY "Users can update their own cart items" ON public.cart_items FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own cart items" ON public.cart_items;
CREATE POLICY "Users can delete their own cart items" ON public.cart_items FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- === deal_coins ===
DROP POLICY IF EXISTS "Users can view their own coin balance" ON public.deal_coins;
CREATE POLICY "Users can view their own coin balance" ON public.deal_coins FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- === deal_coins_transactions ===
DROP POLICY IF EXISTS "Users can view their own transactions" ON public.deal_coins_transactions;
CREATE POLICY "Users can view their own transactions" ON public.deal_coins_transactions FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Fix 2: Remove dangerous INSERT policy entirely - transactions created server-side only
DROP POLICY IF EXISTS "Users can insert their own transactions" ON public.deal_coins_transactions;

-- === price_history ===
DROP POLICY IF EXISTS "Anyone can view price history" ON public.price_history;
CREATE POLICY "Anyone can view price history" ON public.price_history FOR SELECT TO public USING (true);

-- === daily_deals ===
DROP POLICY IF EXISTS "Anyone can view active deals" ON public.daily_deals;
CREATE POLICY "Anyone can view active deals" ON public.daily_deals FOR SELECT TO public USING ((is_active = true) AND (ends_at > now()));

-- === view_counter ===
DROP POLICY IF EXISTS "Anyone can view the counter" ON public.view_counter;
CREATE POLICY "Anyone can view the counter" ON public.view_counter FOR SELECT TO public USING (true);