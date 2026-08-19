import React, { useState } from 'react';
import { X, Calendar, Wrench, CheckCircle2, User, FileText, Package } from 'lucide-react';
import { ServiceMonth } from '../../types';

interface ServiceDetailModalProps {
  serviceMonth: ServiceMonth;
  onClose: () => void;
  onOpenParts: (month: ServiceMonth) => void;
  onUpdateMonth: (updated: ServiceMonth) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({ serviceMonth, onClose, onOpenParts, onUpdateMonth }) => {
  const [technician, setTechnician] = useState(serviceMonth.technician || 'محمد ناصری');
  const [notes, setNotes] = useState(serviceMonth.notes || '');
  const [status, setStatus] = useState(serviceMonth.status);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateMonth({
      ...serviceMonth,
      technician,
      notes,
      status
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base">جزئیات سرویس ماه {serviceMonth.monthName} {serviceMonth.year}</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
          
          {saved && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>تغییرات با موفقیت ذخیره شد.</span>
            </div>
          )}

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-slate-500 block mb-0.5">تاریخ برنامه‌ریزی شده</span>
              <strong className="text-slate-900 text-sm">{serviceMonth.jalaliDate}</strong>
            </div>
            <div className="text-right">
              <span className="text-slate-500 block mb-0.5">وضعیت سرویس</span>
              <select 
                value={status}
                onChange={(e) => setStatus(e.target.value as ServiceMonth['status'])}
                className="px-3 py-1 bg-white border border-slate-300 rounded-lg font-medium text-slate-800"
              >
                <option value="completed">انجام شده</option>
                <option value="in_progress">در حال انجام</option>
                <option value="scheduled">برنامه‌ریزی شده</option>
                <option value="pending">در انتظار تایید</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-blue-600" />
              <span>سرویس‌کار / تکنسین مسئول</span>
            </label>
            <select 
              value={technician}
              onChange={(e) => setTechnician(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-amber-500"
            >
              <option value="محمد ناصری">محمد ناصری (تکنسین ارشد)</option>
              <option value="علی حیدری">علی حیدری (متخصص مکانیک)</option>
              <option value="حسین رضایی">حسین رضایی (تکنسین برق و تابلو فرمان)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-amber-600" />
              <span>گزارش و یادداشت سرویس</span>
            </label>
            <textarea 
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="توضیحات انجام سرویس، وضعیت قطعات..." 
              className="w-full p-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center justify-between gap-2 pt-2">
            <button 
              type="button"
              onClick={() => onOpenParts(serviceMonth)}
              className="px-4 py-2 bg-violet-100 hover:bg-violet-200 text-violet-800 rounded-xl font-medium transition flex items-center gap-1.5"
            >
              <Package className="w-4 h-4" />
              <span>قطعات و هزینه‌های این ماه</span>
            </button>
            <div className="flex items-center gap-2">
              <button 
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition"
              >
                انصراف
              </button>
              <button 
                type="submit"
                className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold shadow transition flex items-center gap-1.5"
              >
                <Wrench className="w-4 h-4" />
                <span>ذخیره تغییرات</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
