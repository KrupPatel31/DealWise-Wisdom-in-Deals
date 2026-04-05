CREATE POLICY "Deny client delete on orders"
ON public.orders
FOR DELETE
TO authenticated
USING (false);