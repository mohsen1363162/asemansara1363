import { createClient } from '@supabase/supabase-js';
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

export const supabase = createClient(APP_CONFIG.supabaseUrl, APP_CONFIG.supabasePublishableKey);

export const ensureBackupTableExistsHelp = `
1) به Supabase بروید
2) SQL Editor را باز کنید
3) New query بزنید
4) این دستور را اجرا کنید:

create table if not exists app_backups (
  id uuid primary key default gen_random_uuid(),
  backup_key text unique not null,
  payload jsonb not null,
  updated_at timestamptz default now()
);
`;

export const saveBackupToSupabase = async (backupData: CloudBackupData) => {
  const { error } = await supabase
    .from(APP_CONFIG.backupTableName)
    .upsert(
      {
        backup_key: APP_CONFIG.backupKey,
        payload: backupData,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'backup_key' }
    );

  if (error) {
    throw error;
  }
};

export const loadBackupFromSupabase = async (): Promise<CloudBackupData | null> => {
  const { data, error } = await supabase
    .from(APP_CONFIG.backupTableName)
    .select('payload')
    .eq('backup_key', APP_CONFIG.backupKey)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data?.payload as CloudBackupData) || null;
};
