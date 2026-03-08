
-- Create rate limiting table for password resets
CREATE TABLE public.password_reset_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  attempted_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Index for efficient lookups
CREATE INDEX idx_reset_attempts_email_time ON public.password_reset_attempts (email, attempted_at);

-- Enable RLS and deny all client access
ALTER TABLE public.password_reset_attempts ENABLE ROW LEVEL SECURITY;

-- Auto-cleanup old attempts (older than 1 hour)
CREATE OR REPLACE FUNCTION public.cleanup_old_reset_attempts()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.password_reset_attempts WHERE attempted_at < now() - interval '1 hour';
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_cleanup_reset_attempts
  AFTER INSERT ON public.password_reset_attempts
  FOR EACH STATEMENT
  EXECUTE FUNCTION public.cleanup_old_reset_attempts();

-- Fix get_or_create_deal_coins: remove parameter, use auth.uid() directly
CREATE OR REPLACE FUNCTION public.get_or_create_deal_coins()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_balance INTEGER;
  p_user_id UUID := auth.uid();
BEGIN
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT balance INTO current_balance
  FROM public.deal_coins
  WHERE user_id = p_user_id;
  
  IF NOT FOUND THEN
    INSERT INTO public.deal_coins (user_id, balance, total_earned, total_spent)
    VALUES (p_user_id, 0, 0, 0)
    ON CONFLICT (user_id) DO NOTHING;
    current_balance := 0;
  END IF;
  
  RETURN current_balance;
END;
$$;
