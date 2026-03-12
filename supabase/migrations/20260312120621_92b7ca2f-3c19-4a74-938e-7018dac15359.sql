
REVOKE EXECUTE ON FUNCTION public.award_coins(uuid, integer) FROM PUBLIC, authenticated;
REVOKE EXECUTE ON FUNCTION public.spend_coins(uuid, integer) FROM PUBLIC, authenticated;
GRANT EXECUTE ON FUNCTION public.award_coins(uuid, integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.spend_coins(uuid, integer) TO service_role;
