-- Create a table for website view counter
CREATE TABLE public.view_counter (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    page_path TEXT NOT NULL DEFAULT '/' UNIQUE,
    view_count BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.view_counter ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read the view count (public counter)
CREATE POLICY "Anyone can view the counter" 
ON public.view_counter 
FOR SELECT 
USING (true);

-- Allow anyone to increment the counter (via function)
CREATE POLICY "Anyone can update counter" 
ON public.view_counter 
FOR UPDATE 
USING (true);

-- Allow insert for initial record
CREATE POLICY "Anyone can insert counter" 
ON public.view_counter 
FOR INSERT 
WITH CHECK (true);

-- Create function to increment view count atomically
CREATE OR REPLACE FUNCTION public.increment_view_count(page TEXT DEFAULT '/')
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    current_count BIGINT;
BEGIN
    -- Try to insert or update the counter atomically
    INSERT INTO public.view_counter (page_path, view_count)
    VALUES (page, 1)
    ON CONFLICT (page_path) 
    DO UPDATE SET 
        view_count = view_counter.view_count + 1,
        updated_at = now()
    RETURNING view_count INTO current_count;
    
    RETURN current_count;
END;
$$;

-- Insert initial record
INSERT INTO public.view_counter (page_path, view_count) VALUES ('/', 12847);