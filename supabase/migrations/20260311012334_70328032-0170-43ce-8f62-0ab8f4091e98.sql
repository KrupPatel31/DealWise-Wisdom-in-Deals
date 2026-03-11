
-- Atomic function to spend coins (returns remaining balance, or -1 if insufficient)
CREATE OR REPLACE FUNCTION public.spend_coins(p_user_id uuid, p_amount integer)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  remaining integer;
BEGIN
  UPDATE deal_coins
  SET balance     = balance - p_amount,
      total_spent = total_spent + p_amount,
      updated_at  = now()
  WHERE user_id = p_user_id
    AND balance >= p_amount
  RETURNING balance INTO remaining;

  IF NOT FOUND THEN
    RETURN -1;
  END IF;

  RETURN remaining;
END;
$$;

-- Atomic function to award coins (upserts, returns new balance)
CREATE OR REPLACE FUNCTION public.award_coins(p_user_id uuid, p_amount integer)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_balance integer;
BEGIN
  INSERT INTO deal_coins (user_id, balance, total_earned, total_spent)
  VALUES (p_user_id, p_amount, p_amount, 0)
  ON CONFLICT (user_id)
  DO UPDATE SET
    balance      = deal_coins.balance + p_amount,
    total_earned = deal_coins.total_earned + p_amount,
    updated_at   = now()
  RETURNING balance INTO new_balance;

  RETURN new_balance;
END;
$$;
