-- Fix view_counter RLS policies to be more restrictive
-- Drop the overly permissive INSERT and UPDATE policies
DROP POLICY IF EXISTS "Anyone can insert counter" ON public.view_counter;
DROP POLICY IF EXISTS "Anyone can update counter" ON public.view_counter;

-- Create a more restrictive policy that only allows the increment function to update
-- The increment_view_count function is SECURITY DEFINER so it bypasses RLS
-- We keep the SELECT policy as it's read-only and acceptable for public access

-- Add constraint to prevent arbitrary page paths
ALTER TABLE public.view_counter DROP CONSTRAINT IF EXISTS valid_page_paths;
ALTER TABLE public.view_counter ADD CONSTRAINT valid_page_paths 
  CHECK (page_path IN ('/', '/search', '/about', '/contact', '/orders', '/features', '/how-it-works', '/cart', '/checkout'));

-- Add constraint for positive counts
ALTER TABLE public.view_counter DROP CONSTRAINT IF EXISTS positive_count;
ALTER TABLE public.view_counter ADD CONSTRAINT positive_count CHECK (view_count >= 0);

-- Ensure unique page paths to prevent spam entries
DROP INDEX IF EXISTS view_counter_page_path_unique;
CREATE UNIQUE INDEX IF NOT EXISTS view_counter_page_path_unique ON public.view_counter(page_path);