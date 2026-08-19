import React, { useState } from 'react';
import { X, Ban, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { BreakdownRecord } from '../../types';

interface ReportDowntimeModalProps {
  onClose: () => void;
  onAddBreakdown: (record: BreakdownRecord) => void;
}

export const ReportDowntimeModal: React.FC<ReportDowntimeModalProps> = ({ onClose, onAddBreakdown }) => {
  const [description, setDescription] = useState('');
  const [reportedBy, setReportedBy] = useState('مدیر ساختمان');
  const [technician, setTechnician] = useState('محمد ناصری');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description) return;

    const newRec: BreakdownRecord = {
      id: 'b-' + Date.now(),
      date: '1405/05/22',
      time: '15:40',
      reportedBy,
      description,
      status: 'pending',
      technician
    };

    onAddBreakdown(newRec);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
        
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ban className="w-5 h-5 text-rose-500" />
            <h3 className="font-bold text-base">اعلام توقف و خرابی آسانسور</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>گزارش خرابی با موفقیت ثبت شد و به تکنسین پیامک ارسال گردید.</span>
            </div>
          )}

          <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl flex items-start gap-2.5 text-rose-800">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>با ثبت این فرم، سیستم به صورت خودکار تیکت تعمیراتی ایجاد کرده و تیم سرویس‌کار مقیم را مطلع می‌سازد.</span>
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">شرح خرابی یا مشکل گزارش شده</label>
            <textarea 
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="مثال: توقف کابین بین طبقات، کار نکردن درب اتوماتیک..." 
              className="w-full p-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-medium mb-1">گزارش‌دهنده</label>
              <input 
                type="text" 
                value={reportedBy}
                onChange={(e) => setReportedBy(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">تکنسین اعزامی</label>
              <select 
                value={technician}
                onChange={(e) => setTechnician(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
              >
                <option value="محمد ناصری">محمد ناصری</option>
                <option value="علی حیدری">علی حیدری</option>
                <option value="حسین رضایی">حسین رضایی</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition"
            >
              انصراف
            </button>
            <button 
              type="submit"
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-semibold shadow transition flex items-center gap-1.5"
            >
              <Ban className="w-4 h-4" />
              <span>ثبت و اعزام فوری</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
