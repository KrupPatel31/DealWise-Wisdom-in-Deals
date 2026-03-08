DROP POLICY "Users can update their own coin balance" ON public.deal_coins;
DROP POLICY "Users can insert their own coin record" ON public.deal_coins;

ALTER TABLE public.deal_coins_transactions ADD CONSTRAINT unique_order_transaction UNIQUE (user_id, order_id, type);