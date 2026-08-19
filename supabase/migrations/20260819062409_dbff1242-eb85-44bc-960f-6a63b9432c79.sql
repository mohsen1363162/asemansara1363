ALTER TABLE public.app_backups ADD COLUMN IF NOT EXISTS user_id uuid;

DELETE FROM public.app_backups WHERE user_id IS NULL;

ALTER TABLE public.app_backups ALTER COLUMN user_id SET NOT NULL;

DROP POLICY IF EXISTS "anyone can insert backups" ON public.app_backups;
DROP POLICY IF EXISTS "anyone can read backups" ON public.app_backups;
DROP POLICY IF EXISTS "anyone can update backups" ON public.app_backups;

ALTER TABLE public.app_backups DROP CONSTRAINT IF EXISTS app_backups_backup_key_key;
CREATE UNIQUE INDEX IF NOT EXISTS app_backups_user_key_uidx ON public.app_backups (user_id, backup_key);

REVOKE ALL ON public.app_backups FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.app_backups TO authenticated;
GRANT ALL ON public.app_backups TO service_role;

ALTER TABLE public.app_backups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own backups" ON public.app_backups
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own backups" ON public.app_backups
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own backups" ON public.app_backups
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own backups" ON public.app_backups
  FOR DELETE TO authenticated USING (auth.uid() = user_id);