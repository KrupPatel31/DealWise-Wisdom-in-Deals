-- Add explicit deny policies for INSERT, UPDATE, DELETE on view_counter
-- These ensure no one can directly manipulate the counter
-- The increment_view_count function uses SECURITY DEFINER to bypass RLS for legitimate updates

-- Deny INSERT from anyone (counter entries are created by the function)
CREATE POLICY "No direct insert to view_counter"
ON public.view_counter
FOR INSERT
TO public
WITH CHECK (false);

-- Deny UPDATE from anyone (only function can update)
CREATE POLICY "No direct update to view_counter"
ON public.view_counter
FOR UPDATE
TO public
USING (false);

-- Deny DELETE from anyone
CREATE POLICY "No direct delete from view_counter"
ON public.view_counter
FOR DELETE
TO public
USING (false);