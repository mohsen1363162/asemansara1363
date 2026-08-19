import React, { useState } from 'react';
import { X, Plus, Wrench, Minus, Package } from 'lucide-react';
import { PartItem } from '../../types';

interface PartsSettingsModalProps {
  parts: PartItem[];
  onClose: () => void;
  onAddPart: (part: PartItem) => void;
  onUpdatePart: (part: PartItem) => void;
  onAdjustStock: (id: string, amount: number) => void;
}

export const PartsSettingsModal: React.FC<PartsSettingsModalProps> = ({ parts, onClose, onAddPart, onUpdatePart, onAdjustStock }) => {
  const [form, setForm] = useState({ name: '', unit: 'عدد', price: '', stock: '0', category: 'مصرفی' });
  const [message, setMessage] = useState('');

  const submitPart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price.trim()) {
      setMessage('لطفاً نام قطعه و قیمت را وارد کنید.');
      return;
    }

    onAddPart({
      id: `part-${Date.now()}`,
      name: form.name.trim(),
      unit: form.unit.trim() || 'عدد',
      price: Number(form.price || 0),
      stock: Number(form.stock || 0),
      category: form.category.trim() || 'مصرفی',
    });

    setForm({ name: '', unit: 'عدد', price: '', stock: '0', category: 'مصرفی' });
    setMessage('قطعه جدید با موفقیت به انبار اضافه شد.');
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden border border-slate-200">
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base">تنظیمات قطعات و اقلام مصرفی</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {message && (
            <div className={`rounded-xl px-4 py-3 text-xs font-medium ${message.includes('موفقیت') ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
              {message}
            </div>
          )}

          <form onSubmit={submitPart} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 grid grid-cols-1 md:grid-cols-7 gap-3 text-xs">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="نام قطعه" className="rounded-xl border border-slate-300 px-3 py-2 md:col-span-2" />
            <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="قیمت واحد" className="rounded-xl border border-slate-300 px-3 py-2" />
            <input value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="موجودی اولیه" className="rounded-xl border border-slate-300 px-3 py-2" />
            <input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} placeholder="واحد" className="rounded-xl border border-slate-300 px-3 py-2" />
            <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="دسته‌بندی" className="rounded-xl border border-slate-300 px-3 py-2" />
            <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-4 py-2 font-semibold flex items-center justify-center gap-1.5">
              <Plus className="w-4 h-4" />
              افزودن قطعه
            </button>
          </form>

          <div className="space-y-2">
            {parts.map((part) => (
              <div key={part.id} className="bg-white border border-slate-200 rounded-xl p-4 grid grid-cols-1 md:grid-cols-5 gap-4 items-center text-sm">
                <div className="md:col-span-2">
                  <div className="font-bold text-slate-900 flex items-center gap-2"><Package className="w-4 h-4 text-amber-600" /> {part.name}</div>
                  <div className="text-slate-500 text-xs mt-1">واحد: {part.unit} | دسته: {part.category || 'عمومی'}</div>
                </div>
                <input
                  value={part.price}
                  onChange={(e) => onUpdatePart({ ...part, price: Number(e.target.value || 0) })}
                  className="rounded-xl border border-slate-300 px-3 py-2"
                />
                <div className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 font-bold text-slate-800 text-center">
                  {part.stock.toLocaleString('fa-IR')} {part.unit}
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <button onClick={() => onAdjustStock(part.id, -1)} className="w-10 h-10 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 flex items-center justify-center" type="button"><Minus className="w-4 h-4" /></button>
                  <button onClick={() => onAdjustStock(part.id, 1)} className="w-10 h-10 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 flex items-center justify-center" type="button"><Plus className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
