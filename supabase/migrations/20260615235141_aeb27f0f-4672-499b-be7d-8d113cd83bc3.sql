
-- ============== ENUMS ==============
CREATE TYPE public.app_role AS ENUM ('admin', 'user');
CREATE TYPE public.contestant_status AS ENUM ('active', 'inactive');
CREATE TYPE public.transaction_status AS ENUM ('pending', 'approved', 'rejected');

-- ============== UPDATED_AT HELPER ==============
CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- ============== PROFILES ==============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles self read" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles self update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ============== USER ROLES ==============
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users see own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_role(auth.uid(), 'admin'::public.app_role)
$$;

-- ============== AUTO PROFILE + ROLE ON SIGNUP ==============
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''));

  -- Seed admin role for known admin email
  IF lower(NEW.email) = 'admin@muicons.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin') ON CONFLICT DO NOTHING;
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user') ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============== CONTESTANTS ==============
CREATE TABLE public.contestants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contestant_number INT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  faculty TEXT,
  biography TEXT,
  image TEXT,
  total_votes INT NOT NULL DEFAULT 0,
  status contestant_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.contestants TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.contestants TO authenticated;
GRANT ALL ON public.contestants TO service_role;
ALTER TABLE public.contestants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "contestants public read" ON public.contestants FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "contestants admin insert" ON public.contestants FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "contestants admin update" ON public.contestants FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "contestants admin delete" ON public.contestants FOR DELETE TO authenticated USING (public.is_admin());
CREATE TRIGGER contestants_updated_at BEFORE UPDATE ON public.contestants FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ============== TRANSACTIONS ==============
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contestant_id UUID NOT NULL REFERENCES public.contestants(id) ON DELETE CASCADE,
  voter_name TEXT NOT NULL,
  voter_email TEXT NOT NULL,
  voter_phone TEXT NOT NULL,
  number_of_votes INT NOT NULL CHECK (number_of_votes > 0),
  amount NUMERIC(12,2) NOT NULL CHECK (amount >= 0),
  payment_proof TEXT,
  status transaction_status NOT NULL DEFAULT 'pending',
  approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.transactions TO anon, authenticated;
GRANT INSERT ON public.transactions TO anon, authenticated;
GRANT UPDATE, DELETE ON public.transactions TO authenticated;
GRANT ALL ON public.transactions TO service_role;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
-- public can insert (submit payment)
CREATE POLICY "transactions public insert" ON public.transactions FOR INSERT TO anon, authenticated WITH CHECK (status = 'pending' AND approved_by IS NULL AND approved_at IS NULL);
-- only admins see transactions; (we expose stats via aggregate views/queries)
CREATE POLICY "transactions admin read" ON public.transactions FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "transactions admin update" ON public.transactions FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "transactions admin delete" ON public.transactions FOR DELETE TO authenticated USING (public.is_admin());
CREATE TRIGGER transactions_updated_at BEFORE UPDATE ON public.transactions FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE INDEX idx_transactions_status ON public.transactions(status);
CREATE INDEX idx_transactions_contestant ON public.transactions(contestant_id);
CREATE INDEX idx_transactions_created ON public.transactions(created_at DESC);

-- ============== SETTINGS (singleton) ==============
CREATE TABLE public.settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  competition_name TEXT NOT NULL DEFAULT 'MU Icons',
  competition_banner TEXT,
  voting_open BOOLEAN NOT NULL DEFAULT true,
  bank_account_name TEXT NOT NULL DEFAULT 'MU Icons',
  bank_name TEXT NOT NULL DEFAULT 'Configure in admin settings',
  account_number TEXT NOT NULL DEFAULT '0000000000',
  vote_price NUMERIC(12,2) NOT NULL DEFAULT 100,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.settings TO anon, authenticated;
GRANT UPDATE ON public.settings TO authenticated;
GRANT ALL ON public.settings TO service_role;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings public read" ON public.settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "settings admin update" ON public.settings FOR UPDATE TO authenticated USING (public.is_admin());
CREATE TRIGGER settings_updated_at BEFORE UPDATE ON public.settings FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
INSERT INTO public.settings (id) VALUES (1);

-- ============== AUDIT LOGS ==============
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "audit admin read" ON public.audit_logs FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "audit admin insert" ON public.audit_logs FOR INSERT TO authenticated WITH CHECK (public.is_admin());

-- ============== APPROVE / REJECT FUNCTIONS ==============
CREATE OR REPLACE FUNCTION public.approve_transaction(_tx_id UUID)
RETURNS public.transactions LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _tx public.transactions;
BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'forbidden'; END IF;
  SELECT * INTO _tx FROM public.transactions WHERE id = _tx_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'transaction not found'; END IF;
  IF _tx.status = 'approved' THEN RETURN _tx; END IF;

  UPDATE public.transactions
    SET status = 'approved', approved_by = auth.uid(), approved_at = now()
    WHERE id = _tx_id RETURNING * INTO _tx;

  UPDATE public.contestants SET total_votes = total_votes + _tx.number_of_votes WHERE id = _tx.contestant_id;

  INSERT INTO public.audit_logs (actor_id, action, entity, entity_id, details)
  VALUES (auth.uid(), 'approve', 'transaction', _tx_id, jsonb_build_object('votes', _tx.number_of_votes, 'amount', _tx.amount));

  RETURN _tx;
END; $$;

CREATE OR REPLACE FUNCTION public.reject_transaction(_tx_id UUID)
RETURNS public.transactions LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _tx public.transactions;
BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'forbidden'; END IF;
  UPDATE public.transactions SET status = 'rejected', approved_by = auth.uid(), approved_at = now()
    WHERE id = _tx_id RETURNING * INTO _tx;
  IF NOT FOUND THEN RAISE EXCEPTION 'transaction not found'; END IF;

  INSERT INTO public.audit_logs (actor_id, action, entity, entity_id, details)
  VALUES (auth.uid(), 'reject', 'transaction', _tx_id, jsonb_build_object('amount', _tx.amount));
  RETURN _tx;
END; $$;

GRANT EXECUTE ON FUNCTION public.approve_transaction(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.reject_transaction(UUID) TO authenticated;

-- ============== PUBLIC STATS (safe aggregate, no PII) ==============
CREATE OR REPLACE FUNCTION public.public_stats()
RETURNS TABLE (total_contestants BIGINT, total_votes BIGINT, total_voters BIGINT)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT
    (SELECT COUNT(*) FROM public.contestants WHERE status='active'),
    (SELECT COALESCE(SUM(total_votes),0) FROM public.contestants),
    (SELECT COUNT(DISTINCT voter_email) FROM public.transactions WHERE status='approved');
$$;
GRANT EXECUTE ON FUNCTION public.public_stats() TO anon, authenticated;
