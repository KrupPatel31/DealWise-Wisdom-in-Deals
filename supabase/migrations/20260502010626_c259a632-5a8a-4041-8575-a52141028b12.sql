-- Revoke EXECUTE on SECURITY DEFINER functions from anon/authenticated.
-- These are either trigger functions or are called only by edge functions (service_role).

REVOKE EXECUTE ON FUNCTION public.get_or_create_deal_coins() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.get_or_create_deal_coins(uuid) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.award_coins(uuid, integer) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.spend_coins(uuid, integer) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.increment_view_count(text) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.cleanup_old_reset_attempts() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated, public;