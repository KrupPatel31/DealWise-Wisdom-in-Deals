-- Add policy to explicitly deny anonymous/public access to profiles table
CREATE POLICY "Deny public access to profiles"
ON public.profiles
FOR SELECT
TO anon
USING (false);

-- Add policy to explicitly deny anonymous/public access to orders table
CREATE POLICY "Deny public access to orders"
ON public.orders
FOR SELECT
TO anon
USING (false);