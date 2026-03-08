-- Add explicit deny-all policy on password_reset_attempts to block client access
CREATE POLICY "Deny all client access"
ON public.password_reset_attempts
AS RESTRICTIVE
FOR ALL
TO public
USING (false)
WITH CHECK (false);