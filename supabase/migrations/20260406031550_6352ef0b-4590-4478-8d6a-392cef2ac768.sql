
-- Fix: Convert password_reset_attempts from fragile PERMISSIVE deny to robust RESTRICTIVE deny
DROP POLICY IF EXISTS "Deny all client access" ON public.password_reset_attempts;

CREATE POLICY "Deny all client access"
ON public.password_reset_attempts
AS RESTRICTIVE
FOR ALL
TO public
USING (false)
WITH CHECK (false);
