import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { CloudUpload, CloudDownload, LogIn, AlertCircle } from 'lucide-react';

interface GoogleDrivePanelProps {
  isConnected: boolean;
  clientIdConfigured: boolean;
  onGoogleToken: (accessToken: string) => void;
  onSaveToDrive: () => void;
  onLoadFromDrive: () => void;
  statusMessage: string;
  scope: string;
}

export const GoogleDrivePanel: React.FC<GoogleDrivePanelProps> = ({
  isConnected,
  clientIdConfigured,
  onGoogleToken,
  onSaveToDrive,
  onLoadFromDrive,
  statusMessage,
  scope,
}) => {
  const login = useGoogleLogin({
    scope,
    onSuccess: (tokenResponse) => {
      if (tokenResponse.access_token) {
        onGoogleToken(tokenResponse.access_token);
      }
    },
    onError: () => {
      console.error('Google login failed');
    },
  });

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-4 shadow-xs">
      <div>
        <h3 className="font-bold text-slate-900 text-sm">اتصال به گوگل‌درایو</h3>
        <p className="text-xs text-slate-500 mt-1">برای ذخیره و بازیابی اطلاعات در همه دستگاه‌ها از گوگل‌درایو استفاده کنید.</p>
      </div>

      {!clientIdConfigured && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>
            برای فعال شدن گوگل‌درایو، باید Client ID گوگل را در فایل <strong>src/App.tsx</strong> تنظیم کنید.
          </span>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => login()}
          disabled={!clientIdConfigured}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5"
        >
          <LogIn className="w-4 h-4" />
          اتصال با گوگل
        </button>

        <button
          type="button"
          onClick={onSaveToDrive}
          disabled={!isConnected}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5"
        >
          <CloudUpload className="w-4 h-4" />
          ذخیره در گوگل‌درایو
        </button>

        <button
          type="button"
          onClick={onLoadFromDrive}
          disabled={!isConnected}
          className="bg-violet-600 hover:bg-violet-700 disabled:bg-slate-300 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5"
        >
          <CloudDownload className="w-4 h-4" />
          بازیابی از گوگل‌درایو
        </button>
      </div>

      {statusMessage && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700">{statusMessage}</div>
      )}
    </div>
  );
};
