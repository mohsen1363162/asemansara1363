import React, { useMemo, useState } from 'react';
import { ArrowRight, Package, Plus, Minus, FileText } from 'lucide-react';
import { Contract, PartItem } from '../types';

interface ManagementViewsProps {
  section: string;
  contracts: Contract[];
  parts: PartItem[];
  isDarkMode: boolean;
  onBackToService: () => void;
  onSelectContract: (c: Contract) => void;
  onAddPart: (part: PartItem) => void;
  onUpdatePart: (part: PartItem) => void;
  onAdjustPartStock: (id: string, amount: number) => void;
}

export const ManagementViews: React.FC<ManagementViewsProps> = ({
  section,
  contracts,
  parts,
  isDarkMode,
  onBackToService,
  onSelectContract,
  onAddPart,
  onUpdatePart,
  onAdjustPartStock,
}) => {
  const [selectedDebtIds, setSelectedDebtIds] = useState<string[]>([]);
  const [showNewPartForm, setShowNewPartForm] = useState(false);
  const [newPart, setNewPart] = useState({ name: '', unit: 'عدد', price: '', stock: '0', category: 'مصرفی' });

  const debtContracts = useMemo(() => contracts.filter((c) => c.buildingDebt > 0 || c.contractDebt > 0), [contracts]);
  const selectedDebtTotal = debtContracts
    .filter((c) => selectedDebtIds.includes(c.id))
    .reduce((sum, c) => sum + c.contractDebt, 0);

  const submitNewPart = () => {
    if (!newPart.name.trim() || !newPart.price.trim()) return;
    onAddPart({
      id: `part-${Date.now()}`,
      name: newPart.name.trim(),
      unit: newPart.unit.trim() || 'عدد',
      price: Number(newPart.price || 0),
      stock: Number(newPart.stock || 0),
      category: newPart.category.trim() || 'مصرفی',
    });
    setNewPart({ name: '', unit: 'عدد', price: '', stock: '0', category: 'مصرفی' });
    setShowNewPartForm(false);
  };

  if (section === 'warehouse') {
    return (
      <div className={`flex-1 p-6 overflow-y-auto select-none transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-800'}`}>
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">مدیریت انبار قطعات</h2>
              <p className="text-xs text-slate-500 mt-1">افزایش/کاهش موجودی، ویرایش قیمت و کنترل اقلام مصرفی</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowNewPartForm((prev) => !prev)} className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow transition">
                قطعه جدید
              </button>
              <button onClick={onBackToService} className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow transition">
                <ArrowRight className="w-4 h-4" />
                <span>بازگشت به قرارداد</span>
              </button>
            </div>
          </div>

          {showNewPartForm && (
            <div className="bg-white border border-slate-200 rounded-2xl p-4 grid grid-cols-1 md:grid-cols-6 gap-3 text-sm">
              <input value={newPart.name} onChange={(e) => setNewPart({ ...newPart, name: e.target.value })} placeholder="نام قطعه" className="rounded-xl border border-slate-300 px-3 py-2 md:col-span-2" />
              <input value={newPart.price} onChange={(e) => setNewPart({ ...newPart, price: e.target.value })} placeholder="قیمت" className="rounded-xl border border-slate-300 px-3 py-2" />
              <input value={newPart.stock} onChange={(e) => setNewPart({ ...newPart, stock: e.target.value })} placeholder="موجودی" className="rounded-xl border border-slate-300 px-3 py-2" />
              <input value={newPart.unit} onChange={(e) => setNewPart({ ...newPart, unit: e.target.value })} placeholder="واحد" className="rounded-xl border border-slate-300 px-3 py-2" />
              <input value={newPart.category} onChange={(e) => setNewPart({ ...newPart, category: e.target.value })} placeholder="توضیحات / دسته" className="rounded-xl border border-slate-300 px-3 py-2" />
              <button onClick={submitNewPart} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-4 py-2 font-semibold">ثبت قطعه</button>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            {parts.map((part) => (
              <div key={part.id} className="bg-white border border-slate-200 rounded-2xl p-5 grid grid-cols-1 lg:grid-cols-5 gap-4 items-center">
                <div className="lg:col-span-2">
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-2"><Package className="w-4 h-4 text-amber-600" /> {part.name}</div>
                  <div className="text-xs text-slate-500 mt-1">واحد: {part.unit} | دسته: {part.category || 'عمومی'}</div>
                </div>

                <div>
                  <label className="block text-xs text-slate-500 mb-1">قیمت قطعه</label>
                  <input
                    value={part.price}
                    onChange={(e) => onUpdatePart({ ...part, price: Number(e.target.value || 0) })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-500 mb-1">موجودی فعلی</label>
                  <div className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-sm font-bold text-slate-800">{part.stock.toLocaleString('fa-IR')} {part.unit}</div>
                </div>

                <div className="flex items-center gap-2 justify-end">
                  <button onClick={() => onAdjustPartStock(part.id, -1)} className="w-10 h-10 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 flex items-center justify-center"><Minus className="w-4 h-4" /></button>
                  <button onClick={() => onAdjustPartStock(part.id, 1)} className="w-10 h-10 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 flex items-center justify-center"><Plus className="w-4 h-4" /></button>
                  <div className="text-xs text-slate-500">کم / زیاد</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (section === 'cartable') {
    return (
      <div className={`flex-1 p-6 overflow-y-auto select-none transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-800'}`}>
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">گزارش مشتریان بدهکار</h2>
              <p className="text-xs text-slate-500 mt-1">می‌توانید مشتریان بدهکار را انتخاب و گزارش مالی آماده کنید</p>
            </div>
            <button onClick={onBackToService} className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow transition">
              <ArrowRight className="w-4 h-4" />
              <span>بازگشت به قرارداد</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50">
              <div className="text-sm font-bold text-slate-800">لیست بدهکاران</div>
              <button className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs">
                <FileText className="w-4 h-4" />
                ثبت / چاپ گزارش
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {debtContracts.map((c, index) => {
                const checked = selectedDebtIds.includes(c.id);
                return (
                  <label key={c.id} className="grid grid-cols-12 items-center px-4 py-3 text-sm hover:bg-slate-50 cursor-pointer">
                    <div className="col-span-1">{index + 1}</div>
                    <div className="col-span-4 font-medium text-slate-900">{c.customerName}</div>
                    <div className="col-span-3 text-slate-600">{c.buildingName}</div>
                    <div className="col-span-2 font-bold text-rose-600">{c.contractDebt.toLocaleString('fa-IR')} ریال</div>
                    <div className="col-span-2 flex items-center justify-end gap-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          onSelectContract(c);
                          onBackToService();
                        }}
                        className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg text-[11px] font-semibold"
                      >
                        رفتن به قرارداد
                      </button>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => setSelectedDebtIds((prev) => checked ? prev.filter((id) => id !== c.id) : [...prev, c.id])}
                      />
                    </div>
                  </label>
                );
              })}
            </div>
            <div className="px-4 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-sm">
              <span className="text-slate-600">مجموع بدهی انتخاب‌شده</span>
              <strong className="text-rose-700 text-base">{selectedDebtTotal.toLocaleString('fa-IR')} ریال</strong>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const titleMap: Record<string, { title: string; desc: string }> = {
    installation: { title: 'نصب و راه‌اندازی تجهیزات', desc: 'پیگیری پروژه‌های نصب و تحویل آسانسور' },
    case: { title: 'پرونده‌ها', desc: 'آرشیو پرونده‌ها و اسناد ساختمان‌ها' },
    financial: { title: 'مدیریت مالی', desc: 'گزارش‌های مالی و مانده حساب‌ها' },
    settings: { title: 'تنظیمات اولیه', desc: 'مدیریت تنظیمات سامانه' },
  };

  const info = titleMap[section] || { title: 'بخش مدیریتی', desc: 'امکانات مدیریتی سامانه' };

  return (
    <div className={`flex-1 p-6 overflow-y-auto select-none transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-800'}`}>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{info.title}</h2>
            <p className="text-xs text-slate-500 mt-1">{info.desc}</p>
          </div>
          <button onClick={onBackToService} className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow transition">
            <ArrowRight className="w-4 h-4" />
            <span>بازگشت به قرارداد</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {contracts.map((c) => (
            <div key={c.id} onClick={() => { onSelectContract(c); onBackToService(); }} className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-amber-500 shadow-xs hover:shadow-md transition cursor-pointer">
              <div className="font-bold text-slate-900">{c.buildingName}</div>
              <div className="text-xs text-slate-500 mt-1">{c.customerName}</div>
              <div className="text-xs text-rose-600 font-bold mt-3">بدهی: {c.contractDebt.toLocaleString('fa-IR')} ریال</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
