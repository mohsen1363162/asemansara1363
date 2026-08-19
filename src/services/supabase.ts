import { supabase } from '@/integrations/supabase/client';
import { Contract, PartItem, ServiceMonth, BreakdownRecord } from '../types';
import { APP_CONFIG } from '../config';

export type ContractScopedData = {
  serviceMonths: ServiceMonth[];
  breakdowns: BreakdownRecord[];
  payments: {
    id: string;
    date: string;
    amount: number;
    receiptNumber: string;
    method: string;
    description: string;
  }[];
};

export type CloudBackupData = {
  version: string;
  exportedAt: string;
  isDarkMode: boolean;
  contracts: Contract[];
  currentContractId: string;
  activeSection: string;
  contractDataMap: Record<string, ContractScopedData>;
  parts: PartItem[];
};

export { supabase };

export const ensureBackupTableExistsHelp = `
داده‌های ابری اکنون فقط برای حساب کاربری شما ذخیره می‌شود.
برای ذخیره یا بازیابی باید وارد حساب خود شده باشید؛
هیچ کاربر دیگری به اطلاعات شما دسترسی ندارد.
`;

const getCurrentUserId = async (): Promise<string> => {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    throw new Error('برای استفاده از فضای ابری ابتدا وارد حساب کاربری شوید.');
  }
  return data.user.id;
};

export const saveBackupToSupabase = async (backupData: CloudBackupData) => {
  const userId = await getCurrentUserId();
  const { error } = await supabase
    .from('app_backups')
    .upsert(
      {
        user_id: userId,
        backup_key: APP_CONFIG.backupKey,
        payload: backupData as unknown as never,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,backup_key' }
    );

  if (error) {
    throw error;
  }
};

export const loadBackupFromSupabase = async (): Promise<CloudBackupData | null> => {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from('app_backups')
    .select('payload')
    .eq('user_id', userId)
    .eq('backup_key', APP_CONFIG.backupKey)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data?.payload as unknown as CloudBackupData) || null;
};
