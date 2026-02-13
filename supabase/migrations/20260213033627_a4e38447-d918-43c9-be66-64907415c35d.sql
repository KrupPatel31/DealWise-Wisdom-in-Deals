
-- Fix 1: Add auth check to get_or_create_deal_coins to prevent accessing other users' coins
CREATE OR REPLACE FUNCTION public.get_or_create_deal_coins(p_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_balance INTEGER;
BEGIN
  -- Verify caller can only access their own coins
  IF p_user_id != auth.uid() THEN
    RAISE EXCEPTION 'Access denied';
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

-- Fix 2: Enable RLS on pending_password_resets and deny all access (service role bypasses RLS)
ALTER TABLE public.pending_password_resets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Deny all access to pending_password_resets"
ON public.pending_password_resets
FOR ALL
USING (false)
WITH CHECK (false);
