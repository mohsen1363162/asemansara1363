import React from 'react';
import { CloudUpload, CloudDownload, Database, AlertCircle } from 'lucide-react';

interface CloudSyncPanelProps {
  onSaveToCloud: () => void;
  onLoadFromCloud: () => void;
  statusMessage: string;
  setupHint: string;
}

export const CloudSyncPanel: React.FC<CloudSyncPanelProps> = ({
  onSaveToCloud,
  onLoadFromCloud,
  statusMessage,
  setupHint,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-4 shadow-xs">
      <div>
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2"><Database className="w-4 h-4 text-emerald-600" /> همگام‌سازی ابری با Supabase</h3>
        <p className="text-xs text-slate-500 mt-1">بعد از یک‌بار تنظیم SQL، می‌توانید همه اطلاعات را بین دستگاه‌ها ذخیره و بازیابی کنید.</p>
      </div>

      <details className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
        <summary className="cursor-pointer font-semibold flex items-center gap-2 list-none">
          <span className="flex items-center gap-2"><AlertCircle className="w-4 h-4 shrink-0" /> راهنمای یک‌بار تنظیم Supabase</span>
        </summary>
        <div className="mt-3 whitespace-pre-line leading-6">{setupHint}</div>
      </details>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onSaveToCloud}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5"
        >
          <CloudUpload className="w-4 h-4" />
          ذخیره در فضای ابری
        </button>

        <button
          type="button"
          onClick={onLoadFromCloud}
          className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5"
        >
          <CloudDownload className="w-4 h-4" />
          بازیابی از فضای ابری
        </button>
      </div>

      {statusMessage && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 whitespace-pre-line">{statusMessage}</div>
      )}
    </div>
  );
};
