
-- DB-level bounds enforcement
ALTER TABLE public.cart_items
  ADD CONSTRAINT cart_items_price_range CHECK (price >= 0 AND price <= 500000),
  ADD CONSTRAINT cart_items_original_price_range CHECK (original_price >= 0 AND original_price <= 500000),
  ADD CONSTRAINT cart_items_discount_range CHECK (discount >= 0 AND discount <= 100),
  ADD CONSTRAINT cart_items_quantity_range CHECK (quantity BETWEEN 1 AND 100);

-- Tighten INSERT RLS to enforce bounds at the policy level too
DROP POLICY IF EXISTS "Users can insert their own cart items" ON public.cart_items;
CREATE POLICY "Users can insert their own cart items"
ON public.cart_items
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND price >= 0 AND price <= 500000
  AND original_price >= 0 AND original_price <= 500000
  AND discount >= 0 AND discount <= 100
  AND quantity BETWEEN 1 AND 100
);
