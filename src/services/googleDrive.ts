import { Contract, ServiceMonth, BreakdownRecord, PartItem } from '../types';

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

export type GoogleDriveBackupData = {
  version: string;
  exportedAt: string;
  isDarkMode: boolean;
  contracts: Contract[];
  currentContractId: string;
  activeSection: string;
  contractDataMap: Record<string, ContractScopedData>;
  parts: PartItem[];
};

const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.appdata';
const BACKUP_FILE_NAME = 'service-maintenance-backup.json';

export const GOOGLE_DRIVE_SCOPE = DRIVE_SCOPE;

const findBackupFile = async (accessToken: string) => {
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&fields=files(id,name,modifiedTime)&q=${encodeURIComponent(`name='${BACKUP_FILE_NAME}'`)}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('خطا در خواندن فایل‌های گوگل‌درایو');
  }

  const data = await res.json();
  return data.files?.[0] || null;
};

export const saveBackupToGoogleDrive = async (accessToken: string, backupData: GoogleDriveBackupData) => {
  const existingFile = await findBackupFile(accessToken);

  const metadata = {
    name: BACKUP_FILE_NAME,
    parents: ['appDataFolder'],
    mimeType: 'application/json',
  };

  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' }));

  const method = existingFile ? 'PATCH' : 'POST';
  const endpoint = existingFile
    ? `https://www.googleapis.com/upload/drive/v3/files/${existingFile.id}?uploadType=multipart&fields=id,name`
    : 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name';

  const res = await fetch(endpoint, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: form,
  });

  if (!res.ok) {
    throw new Error('ذخیره بکاپ در گوگل‌درایو ناموفق بود');
  }

  return res.json();
};

export const loadBackupFromGoogleDrive = async (accessToken: string): Promise<GoogleDriveBackupData | null> => {
  const existingFile = await findBackupFile(accessToken);
  if (!existingFile) return null;

  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${existingFile.id}?alt=media`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error('خواندن بکاپ از گوگل‌درایو ناموفق بود');
  }

  return res.json();
};
