-- Create deal_coins table to track user coin balances
CREATE TABLE public.deal_coins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  balance INTEGER NOT NULL DEFAULT 0,
  total_earned INTEGER NOT NULL DEFAULT 0,
  total_spent INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  CONSTRAINT deal_coins_balance_non_negative CHECK (balance >= 0)
);

-- Create deal_coins_transactions table for transaction history
CREATE TABLE public.deal_coins_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('earned', 'spent', 'refund')),
  description TEXT,
  order_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX idx_deal_coins_user_id ON public.deal_coins(user_id);
CREATE INDEX idx_deal_coins_transactions_user_id ON public.deal_coins_transactions(user_id);
CREATE INDEX idx_deal_coins_transactions_order_id ON public.deal_coins_transactions(order_id);

-- Enable RLS on both tables
ALTER TABLE public.deal_coins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deal_coins_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for deal_coins
CREATE POLICY "Deny public access to deal_coins"
  ON public.deal_coins
  FOR SELECT
  USING (false);

CREATE POLICY "Users can view their own coin balance"
  ON public.deal_coins
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own coin record"
  ON public.deal_coins
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own coin balance"
  ON public.deal_coins
  FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for deal_coins_transactions
CREATE POLICY "Deny public access to deal_coins_transactions"
  ON public.deal_coins_transactions
  FOR SELECT
  USING (false);

CREATE POLICY "Users can view their own transactions"
  ON public.deal_coins_transactions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions"
  ON public.deal_coins_transactions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Add trigger to update updated_at for deal_coins
CREATE TRIGGER update_deal_coins_updated_at
  BEFORE UPDATE ON public.deal_coins
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to initialize deal coins for a user (called when user first checks their balance)
CREATE OR REPLACE FUNCTION public.get_or_create_deal_coins(p_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_balance INTEGER;
BEGIN
  -- Try to get existing balance
  SELECT balance INTO current_balance
  FROM public.deal_coins
  WHERE user_id = p_user_id;
  
  -- If no record exists, create one
  IF NOT FOUND THEN
    INSERT INTO public.deal_coins (user_id, balance, total_earned, total_spent)
    VALUES (p_user_id, 0, 0, 0)
    ON CONFLICT (user_id) DO NOTHING;
    current_balance := 0;
  END IF;
  
  RETURN current_balance;
END;
$$;