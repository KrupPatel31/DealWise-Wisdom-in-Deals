-- Add explicit RESTRICTIVE policies to deny UPDATE and DELETE operations on price_history
-- This prevents any manipulation of historical pricing data

CREATE POLICY "No direct update to price_history" 
ON public.price_history 
FOR UPDATE 
USING (false);

CREATE POLICY "No direct delete from price_history" 
ON public.price_history 
FOR DELETE 
USING (false);