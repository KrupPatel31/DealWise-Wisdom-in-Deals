-- Create table for price history tracking
CREATE TABLE public.price_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_name TEXT NOT NULL,
  store TEXT NOT NULL,
  price NUMERIC NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.price_history ENABLE ROW LEVEL SECURITY;

-- Everyone can view price history (public data)
CREATE POLICY "Anyone can view price history"
ON public.price_history
FOR SELECT
USING (true);

-- Only system can insert (via edge function)
CREATE POLICY "System can insert price history"
ON public.price_history
FOR INSERT
WITH CHECK (false);

-- Create index for faster queries
CREATE INDEX idx_price_history_product ON public.price_history(product_name, store, recorded_at DESC);

-- Create table for deals of the day
CREATE TABLE public.daily_deals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  original_price NUMERIC NOT NULL,
  deal_price NUMERIC NOT NULL,
  discount_percent INTEGER NOT NULL,
  image_url TEXT,
  store TEXT NOT NULL,
  product_link TEXT,
  category TEXT,
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.daily_deals ENABLE ROW LEVEL SECURITY;

-- Everyone can view active deals
CREATE POLICY "Anyone can view active deals"
ON public.daily_deals
FOR SELECT
USING (is_active = true AND ends_at > now());

-- Create index for faster queries
CREATE INDEX idx_daily_deals_active ON public.daily_deals(is_active, ends_at) WHERE is_active = true;

-- Add trigger for updated_at
CREATE TRIGGER update_daily_deals_updated_at
BEFORE UPDATE ON public.daily_deals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();