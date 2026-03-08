
-- Fix privilege escalation: deactivated users can reactivate themselves
-- Drop the existing UPDATE policy and recreate with is_active check
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING ((auth.uid() = user_id) AND (is_active = true))
WITH CHECK ((auth.uid() = user_id) AND (is_active = true));
