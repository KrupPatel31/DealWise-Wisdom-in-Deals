-- Implement soft-delete for profiles instead of hard delete
-- This preserves data integrity while allowing users to deactivate accounts

-- Step 1: Add soft-delete columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Step 2: Drop the DELETE policy to prevent hard deletes
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;

-- Step 3: Update the SELECT policy to only show active profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id AND is_active = true);

-- Step 4: Update the UPDATE policy (users can deactivate their own profile)
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);