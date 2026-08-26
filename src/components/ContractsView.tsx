import React, { useMemo, useState } from 'react';
import {
  Search,
  ChevronDown,
  RefreshCw,
  Settings2,
  FileSpreadsheet,
  FileText,
  SlidersHorizontal,
  X,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Contract } from '../types';

interface ContractsViewProps {
  contracts: Contract[];
  isDarkMode: boolean;
  onSelectContract: (c: Contract) => void;
  onNewContract: (kind: 'service' | 'general' | 'other') => void;
}

const TABS: { id: string; label: string; count: (c: Contract[]) => number; tone: string }[] = [
  { id: 'active', label: 'فعال', count: (c) => c.filter((x) => x.status === 'active').length, tone: 'bg-emerald-500' },
  { id: 'general', label: 'جنرال', count: () => 0, tone: 'bg-sky-500' },
  { id: 'other', label: 'متفرقه', count: () => 0, tone: 'bg-amber-500' },
  { id: 'draft', label: 'پیش‌نویس', count: () => 0, tone: 'bg-slate-400' },
  { id: 'renewing', label: 'در حال تمدید', count: (c) => c.filter((x) => x.status === 'expired').length, tone: 'bg-rose-500' },
];

export const ContractsView: React.FC<ContractsViewProps> = ({ contracts, isDarkMode, onSelectContract, onNewContract }) => {
  const [activeTab, setActiveTab] = useState('active');
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const rows = useMemo(() => {
    let list = contracts;
    if (activeTab === 'active') list = contracts.filter((c) => c.status === 'active');
    if (activeTab === 'renewing') list = contracts.filter((c) => c.status === 'expired');
    if (activeTab === 'general' || activeTab === 'other' || activeTab === 'draft') list = [];
    const q = query.trim();
    if (!q) return list;
    return list.filter((c) =>
      [c.contractNumber, c.buildingName, c.customerName, c.coordinator, c.address].some((v) => v.includes(q))
    );
  }, [contracts, activeTab, query]);

  const card = isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200';
  const muted = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const headRow = isDarkMode ? 'bg-slate-800/70 text-slate-300' : 'bg-slate-50 text-slate-600';
  const rowHover = isDarkMode ? 'hover:bg-slate-800/60' : 'hover:bg-amber-50/60';
  const iconBtn = `p-2 rounded-lg transition ${isDarkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-100'}`;

  return (
    <div className={`flex-1 overflow-y-auto p-4 select-none ${isDarkMode ? 'bg-slate-950' : 'bg-slate-100'}`}>
      <div className={`rounded-2xl border shadow-xs ${card}`}>
        {/* Toolbar */}
        <div className={`flex flex-wrap items-center gap-2 p-3 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
          <div className="flex items-center gap-1.5 flex-wrap">
            {TABS.map((t) => {
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                    isActive
                      ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                      : isDarkMode
                        ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{t.label}</span>
                  <span className={`text-[10px] text-white px-1.5 py-0.5 rounded-md ${isActive ? 'bg-white/25' : t.tone}`}>
                    {t.count(contracts).toLocaleString('fa-IR')}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow-sm"
            >
              <ChevronDown className="w-3.5 h-3.5" />
              ثبت قرارداد
            </button>
            {menuOpen && (
              <div className={`absolute z-30 mt-1 w-56 rounded-xl border shadow-lg overflow-hidden ${card}`}>
                {[
                  { id: 'service', label: 'ثبت قرارداد سرویس و نگهداری' },
                  { id: 'general', label: 'ثبت قرارداد جنرال' },
                  { id: 'other', label: 'ثبت قرارداد متفرقه' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setMenuOpen(false);
                      onNewContract(item.id as 'service' | 'general' | 'other');
                    }}
                    className={`w-full text-right px-4 py-2.5 text-xs transition ${
                      isDarkMode ? 'text-slate-200 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 mr-auto">
            <button className={iconBtn} title="خروجی اکسل" aria-label="خروجی اکسل"><FileSpreadsheet className="w-4 h-4" /></button>
            <button className={iconBtn} title="خروجی PDF" aria-label="خروجی PDF"><FileText className="w-4 h-4" /></button>
            <button className={iconBtn} title="بارگذاری مجدد" aria-label="بارگذاری مجدد"><RefreshCw className="w-4 h-4" /></button>
            <button className={iconBtn} title="تنظیمات ستون‌ها" aria-label="تنظیمات ستون‌ها"><Settings2 className="w-4 h-4" /></button>
            <button className={`${iconBtn} relative`} title="فیلترها" aria-label="فیلترها">
              <SlidersHorizontal className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-rose-500 rounded-full" />
            </button>
          </div>

          <div className={`flex items-center gap-2 rounded-lg border px-2.5 py-1.5 min-w-[220px] ${isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'}`}>
            <Search className={`w-3.5 h-3.5 ${muted}`} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجو در قراردادها..."
              className={`bg-transparent outline-none text-xs flex-1 ${isDarkMode ? 'text-slate-100 placeholder:text-slate-500' : 'text-slate-700 placeholder:text-slate-400'}`}
            />
            {query && (
              <button onClick={() => setQuery('')} aria-label="پاک کردن جستجو" className={muted}>
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className={headRow}>
              <tr>
                {['ردیف', 'شماره قرارداد', 'نام ساختمان', 'نام مسئول هماهنگی', 'منطقه', 'تاریخ شروع', 'تاریخ پایان', ''].map((h) => (
                  <th key={h} className="px-3 py-3 font-semibold text-right whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((c, i) => (
                <tr
                  key={c.id}
                  onClick={() => onSelectContract(c)}
                  className={`cursor-pointer border-t transition ${isDarkMode ? 'border-slate-800' : 'border-slate-100'} ${rowHover}`}
                >
                  <td className={`px-3 py-3 ${muted}`}>{(i + 1).toLocaleString('fa-IR')}</td>
                  <td className="px-3 py-3 font-mono font-bold text-amber-600">{c.contractNumber}</td>
                  <td className={`px-3 py-3 font-semibold ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>{c.buildingName}</td>
                  <td className="px-3 py-3">{c.coordinator}</td>
                  <td className="px-3 py-3">{c.customerName}</td>
                  <td className="px-3 py-3 font-mono">{c.startDate}</td>
                  <td className="px-3 py-3 font-mono">{c.endDate}</td>
                  <td className="px-3 py-3">
                    <button aria-label="عملیات بیشتر" className={iconBtn} onClick={(e) => e.stopPropagation()}>
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={8} className={`px-3 py-14 text-center ${muted}`}>موردی برای نمایش وجود ندارد</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className={`flex items-center justify-between p-3 border-t text-xs ${isDarkMode ? 'border-slate-700 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
          <span>{rows.length.toLocaleString('fa-IR')} مورد پیدا شد</span>
          <div className="flex items-center gap-2">
            <button className={iconBtn} aria-label="صفحه بعد"><ChevronLeft className="w-4 h-4" /></button>
            <span className={`px-3 py-1 rounded-lg border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>۱</span>
            <button className={iconBtn} aria-label="صفحه قبل"><ChevronRight className="w-4 h-4" /></button>
            <span className={`px-2 py-1 rounded-lg border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>۲۰ / صفحه</span>
          </div>
        </div>
      </div>
    </div>
  );
};
