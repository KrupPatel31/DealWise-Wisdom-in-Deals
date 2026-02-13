
CREATE TABLE public.pending_password_resets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  new_password TEXT NOT NULL,
  token UUID NOT NULL DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '1 hour'),
  used BOOLEAN NOT NULL DEFAULT false
);

-- Enable RLS with no public policies = only service role can access
ALTER TABLE public.pending_password_resets ENABLE ROW LEVEL SECURITY;

-- Create index for lookups
CREATE INDEX idx_pending_resets_email ON public.pending_password_resets (email, used, expires_at);
