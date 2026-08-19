CREATE TABLE public.app_backups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  backup_key text UNIQUE NOT NULL,
  payload jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.app_backups TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.app_backups TO authenticated;
GRANT ALL ON public.app_backups TO service_role;
ALTER TABLE public.app_backups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can read backups" ON public.app_backups FOR SELECT USING (true);
CREATE POLICY "anyone can insert backups" ON public.app_backups FOR INSERT WITH CHECK (true);
CREATE POLICY "anyone can update backups" ON public.app_backups FOR UPDATE USING (true) WITH CHECK (true);