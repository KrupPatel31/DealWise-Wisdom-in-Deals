-- Drop the pending_password_resets table entirely
-- This table stored plaintext passwords which is a security risk
-- The new flow uses Supabase's built-in password reset which never stores plaintext passwords
DROP TABLE IF EXISTS public.pending_password_resets;
