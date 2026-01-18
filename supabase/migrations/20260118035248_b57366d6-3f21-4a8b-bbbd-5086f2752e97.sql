-- Add policy to explicitly deny anonymous/public access to cart_items
CREATE POLICY "Deny public access to cart items"
ON public.cart_items
FOR SELECT
TO anon
USING (false);