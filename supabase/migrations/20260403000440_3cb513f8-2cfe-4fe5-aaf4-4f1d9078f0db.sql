-- Fix 2: Restrict profiles INSERT/UPDATE to prevent arbitrary email values
-- Drop existing INSERT policy and replace with one that validates email matches auth user
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;
CREATE POLICY "Users can create their own profile"
  ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND (email IS NULL OR email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );

-- Drop existing UPDATE policy and replace with email validation
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = user_id AND is_active = true)
  WITH CHECK (
    auth.uid() = user_id
    AND is_active = true
    AND (email IS NULL OR email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );