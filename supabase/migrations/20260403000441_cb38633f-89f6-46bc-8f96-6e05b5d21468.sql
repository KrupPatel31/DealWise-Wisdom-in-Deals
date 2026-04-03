-- Fix 3: Remove client DELETE policy on orders to preserve audit trail
DROP POLICY IF EXISTS "Users can delete their own orders" ON public.orders;