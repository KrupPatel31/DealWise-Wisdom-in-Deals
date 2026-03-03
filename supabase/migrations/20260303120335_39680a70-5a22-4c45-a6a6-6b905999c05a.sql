-- Fix: Add missing SELECT and UPDATE RLS policies for authenticated users on orders table
-- These were never created, causing the Orders page to return empty results

-- Check if policies already exist before creating (using DO block)
DO $$
BEGIN
  -- Add SELECT policy for authenticated users if not exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'orders' AND policyname = 'Authenticated users can view their own orders'
  ) THEN
    CREATE POLICY "Authenticated users can view their own orders"
    ON public.orders
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);
  END IF;

  -- Add UPDATE policy for authenticated users if not exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'orders' AND policyname = 'Authenticated users can update their own orders'
  ) THEN
    CREATE POLICY "Authenticated users can update their own orders"
    ON public.orders
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
  END IF;
END
$$;