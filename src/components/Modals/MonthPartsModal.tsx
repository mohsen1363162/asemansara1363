import React, { useMemo, useState } from 'react';
import { X, Plus, Minus, Package, Receipt } from 'lucide-react';
import { PartItem, ServiceMonth, MonthUsageItem } from '../../types';

interface MonthPartsModalProps {
  month: ServiceMonth;
  parts: PartItem[];
  onClose: () => void;
  onSave: (month: ServiceMonth) => void;
}

export const MonthPartsModal: React.FC<MonthPartsModalProps> = ({ month, parts, onClose, onSave }) => {
  const [selectedPartId, setSelectedPartId] = useState(parts[0]?.id || '');
  const [quantity, setQuantity] = useState('1');
  const [description, setDescription] = useState('');
  const [extraServiceCost, setExtraServiceCost] = useState(String(month.extraServiceCost || 0));
  const [items, setItems] = useState<MonthUsageItem[]>(month.usedParts || []);

  const selectedPart = useMemo(() => parts.find((p) => p.id === selectedPartId), [parts, selectedPartId]);
  const totalPartsCost = items.reduce((sum, item) => sum + item.totalPrice, 0);

  const increaseQuantity = () => {
    setQuantity(String(Number(quantity || 0) + 1));
  };

  const decreaseQuantity = () => {
    setQuantity(String(Math.max(1, Number(quantity || 1) - 1)));
  };

  const addPartToMonth = () => {
    if (!selectedPart) return;
    const qty = Number(quantity || 1);
    const item: MonthUsageItem = {
      id: `usage-${Date.now()}`,
      partId: selectedPart.id,
      partName: selectedPart.name,
      quantity: qty,
      unitPrice: selectedPart.price,
      totalPrice: qty * selectedPart.price,
      description,
      includeInInvoice: true,
    };
    setItems((prev) => [item, ...prev]);
    setQuantity('1');
    setDescription('');
  };

  const submitMonth = () => {
    onSave({
      ...month,
      usedParts: items,
      extraServiceCost: Number(extraServiceCost || 0),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden border border-slate-200">
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base">قطعات و هزینه‌های ماه {month.monthName} {month.year}</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 max-h-[80vh] overflow-y-auto">
          <div className="lg:col-span-2 space-y-3">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
              <select value={selectedPartId} onChange={(e) => setSelectedPartId(e.target.value)} className="rounded-xl border border-slate-300 px-3 py-2 md:col-span-2 bg-white text-slate-900">
                {parts.map((part) => (
                  <option key={part.id} value={part.id}>{part.name} - {part.price.toLocaleString('fa-IR')} ریال</option>
                ))}
              </select>
              <div className="flex items-center rounded-xl border border-slate-300 overflow-hidden">
                <button type="button" onClick={increaseQuantity} className="px-3 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100">
                  <Plus className="w-4 h-4" />
                </button>
                <input value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="تعداد" className="w-full px-3 py-2 text-center outline-none bg-white text-slate-900 placeholder-slate-400" />
                <button type="button" onClick={decreaseQuantity} className="px-3 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100">
                  <Minus className="w-4 h-4" />
                </button>
              </div>
              <button onClick={addPartToMonth} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-4 py-2 font-semibold flex items-center justify-center gap-1">
                <Plus className="w-4 h-4" /> افزودن
              </button>
              <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="توضیح / علت مصرف" className="rounded-xl border border-slate-300 px-3 py-2 md:col-span-4 bg-white text-slate-900 placeholder-slate-400" />
            </div>

            <div className="space-y-2">
              {items.length === 0 ? (
                <div className="text-sm text-slate-500 bg-slate-50 border border-slate-200 rounded-xl p-6 text-center">هنوز قطعه‌ای برای این ماه ثبت نشده است.</div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between text-sm">
                    <div>
                      <div className="font-bold text-slate-900">{item.partName}</div>
                      <div className="text-slate-500 text-xs mt-1">تعداد: {item.quantity} | قیمت واحد: {item.unitPrice.toLocaleString('fa-IR')} ریال</div>
                      {item.description && <div className="text-slate-600 text-xs mt-1">{item.description}</div>}
                    </div>
                    <div className="font-bold text-rose-600">{item.totalPrice.toLocaleString('fa-IR')} ریال</div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm">
              <label className="block text-slate-700 font-medium mb-2">هزینه اضافه سرویس / ایاب و ذهاب / خدمات دیگر</label>
              <input value={extraServiceCost} onChange={(e) => setExtraServiceCost(e.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2 bg-white text-slate-900 placeholder-slate-400" />
            </div>

            <div className="bg-violet-50 border border-violet-200 rounded-2xl p-4 text-sm space-y-2">
              <div className="flex items-center gap-2 font-bold text-violet-800"><Receipt className="w-4 h-4" /> خلاصه فاکتور ماه</div>
              <div className="flex justify-between"><span>جمع قطعات</span><strong>{totalPartsCost.toLocaleString('fa-IR')} ریال</strong></div>
              <div className="flex justify-between"><span>هزینه اضافه سرویس</span><strong>{Number(extraServiceCost || 0).toLocaleString('fa-IR')} ریال</strong></div>
              <div className="flex justify-between border-t border-violet-200 pt-2 text-rose-700 font-bold"><span>قابل افزودن به فاکتور</span><span>{(totalPartsCost + Number(extraServiceCost || 0)).toLocaleString('fa-IR')} ریال</span></div>
            </div>

            <button onClick={submitMonth} className="w-full bg-amber-600 hover:bg-amber-700 text-white rounded-xl px-4 py-3 font-bold">ذخیره در ماه و حساب‌کتاب</button>
          </div>
        </div>
      </div>
    </div>
  );
};
