-- Add DELETE policy for profiles table to allow users to delete their own profile
-- This enables GDPR/privacy compliance by allowing users to exercise their right to data deletion

CREATE POLICY "Users can delete their own profile"
ON public.profiles
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);