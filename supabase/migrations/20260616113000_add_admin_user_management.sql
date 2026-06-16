CREATE OR REPLACE FUNCTION public.admin_list_users()
RETURNS TABLE (
  user_id UUID,
  email TEXT,
  full_name TEXT,
  role public.app_role,
  created_at TIMESTAMPTZ,
  last_sign_in_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  RETURN QUERY
  SELECT
    u.id,
    u.email::TEXT,
    COALESCE(p.full_name, '')::TEXT,
    COALESCE((
      SELECT ur.role
      FROM public.user_roles ur
      WHERE ur.user_id = u.id
      ORDER BY CASE WHEN ur.role = 'admin'::public.app_role THEN 0 ELSE 1 END
      LIMIT 1
    ), 'user'::public.app_role) AS role,
    u.created_at,
    u.last_sign_in_at
  FROM auth.users u
  LEFT JOIN public.profiles p ON p.id = u.id
  ORDER BY u.created_at DESC;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_set_user_role(_user_id UUID, _role public.app_role)
RETURNS TABLE (
  user_id UUID,
  email TEXT,
  full_name TEXT,
  role public.app_role,
  created_at TIMESTAMPTZ,
  last_sign_in_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  other_admins INT;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = _user_id) THEN
    RAISE EXCEPTION 'user not found';
  END IF;

  IF _role <> 'admin'::public.app_role THEN
    SELECT COUNT(*) INTO other_admins
    FROM public.user_roles
    WHERE role = 'admin'::public.app_role
      AND user_id <> _user_id;

    IF other_admins = 0 THEN
      RAISE EXCEPTION 'cannot remove the last admin';
    END IF;
  END IF;

  DELETE FROM public.user_roles WHERE user_id = _user_id;
  INSERT INTO public.user_roles (user_id, role) VALUES (_user_id, _role);

  INSERT INTO public.audit_logs (actor_id, action, entity, entity_id, details)
  VALUES (auth.uid(), 'set_role', 'user', _user_id, jsonb_build_object('role', _role));

  RETURN QUERY
  SELECT * FROM public.admin_list_users() WHERE admin_list_users.user_id = _user_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_list_users() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_set_user_role(UUID, public.app_role) TO authenticated;
