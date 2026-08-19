import React from 'react';
import { Search, Bell, Settings, X, Plus, FileText, Sun, Moon } from 'lucide-react';
import { Contract } from '../types';

interface HeaderProps {
  currentContract: Contract;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenContractList: () => void;
  onExportBackup: () => void;
  onImportBackup: (file: File) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentContract, isDarkMode, onToggleTheme, onOpenContractList, onExportBackup, onImportBackup }) => {
  return (
    <header className="bg-slate-900 text-white flex flex-col border-b border-slate-800 select-none">
      {/* Top Window Bar with Tabs */}
      <div className="flex items-center justify-between px-3 pt-2">
        <div className="flex items-center gap-1 overflow-x-auto">
          {/* Tab 1 */}
          <div className="flex items-center gap-2 bg-slate-800 text-slate-200 px-4 py-2 rounded-t-lg border-t-2 border-amber-500 text-xs font-medium shadow-inner">
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>مشاهده‌ی قرارداد ({currentContract.contractNumber})</span>
            <button className="text-slate-400 hover:text-white ml-1">
              <X className="w-3 h-3" />
            </button>
          </div>

          {/* Tab 2: Contracts list shortcut */}
          <button 
            onClick={onOpenContractList}
            className="flex items-center gap-1.5 bg-slate-950/40 hover:bg-slate-800/80 text-slate-400 hover:text-slate-200 px-3 py-2 rounded-t-lg text-xs transition border border-transparent hover:border-slate-700"
          >
            <Plus className="w-3 h-3" />
            <span>لیست قراردادها</span>
          </button>
        </div>

        {/* Window controls simulation */}
        <div className="flex items-center gap-3 text-slate-400">
          <div className="relative">
            <Search className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="جستجوی سریع شماره قرارداد، مشتری..." 
              className="bg-slate-800/90 text-xs text-white placeholder-slate-400 pr-8 pl-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-amber-500 w-64 transition"
            />
          </div>
          <button className="p-1.5 hover:bg-slate-800 rounded-lg transition relative" title="اعلان‌ها">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 left-1 w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
          </button>
          <button
            onClick={onToggleTheme}
            className="p-1.5 hover:bg-slate-800 rounded-lg transition flex items-center gap-1"
            title={isDarkMode ? 'حالت روز' : 'حالت شب'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-sky-300" />}
          </button>
          <button
            onClick={onExportBackup}
            type="button"
            className="p-1.5 hover:bg-slate-800 rounded-lg transition text-xs text-slate-300"
            title="خروجی و بکاپ‌گیری"
          >
            خروجی
          </button>
          <div className="relative p-1.5 hover:bg-slate-800 rounded-lg transition text-xs text-slate-300" title="ایمپورت و بازیابی بکاپ">
            <span>ورود</span>
            <input
              type="file"
              accept="application/json"
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onImportBackup(file);
                e.currentTarget.value = '';
              }}
            />
          </div>
          <button className="p-1.5 hover:bg-slate-800 rounded-lg transition" title="تنظیمات">
            <Settings className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5 pl-2 border-r border-slate-700">
            <button className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition" />
            <button className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition" />
            <button className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition" />
          </div>
        </div>
      </div>
    </header>
  );
};
