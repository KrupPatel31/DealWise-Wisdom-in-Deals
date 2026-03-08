-- Fix 1: Remove client INSERT/UPDATE on orders table (prevents fake order coin farming)
DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can update their own orders" ON public.orders;

-- Fix 2: Restrict product_reviews SELECT to user's own reviews only
DROP POLICY IF EXISTS "Users can view all reviews" ON public.product_reviews;

CREATE POLICY "Users can view their own reviews"
ON public.product_reviews
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);