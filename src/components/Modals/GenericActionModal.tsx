import React, { useState } from 'react';
import { X, CheckCircle2, FileText, Printer, Check } from 'lucide-react';
import { Contract } from '../../types';

interface GenericActionModalProps {
  title: string;
  actionType: string;
  contract: Contract;
  onClose: () => void;
  onSuccessMessage?: (msg: string) => void;
}

export const GenericActionModal: React.FC<GenericActionModalProps> = ({ title, actionType, contract, onClose }) => {
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    deviceName: 'آسانسور شماره 2 - نفربر',
    stops: '8',
    capacity: '6 نفره',
    representativeName: 'مهندس احمدی',
    phone: '09123456789',
    note: 'بررسی کامل انجام شد'
  });

  const handleAction = (e: React.FormEvent) => {
    e.preventDefault();
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
            <FileText className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base">{title} - قرارداد {contract.contractNumber}</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleAction} className="p-6 space-y-4 text-xs">
          
          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>عملیات با موفقیت انجام شد و در سیستم ثبت گردید.</span>
            </div>
          )}

          {actionType.includes('print') && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center space-y-3">
              <Printer className="w-12 h-12 text-purple-600 mx-auto" />
              <p className="font-bold text-slate-800 text-sm">پیش‌نمایش سند جهت چاپ آماده است</p>
              <p className="text-slate-500">قرارداد شماره {contract.contractNumber} متعلق به {contract.buildingName}</p>
              <button 
                type="button"
                onClick={() => window.print()}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl font-semibold shadow transition"
              >
                چاپ مستقیم سند (Print)
              </button>
            </div>
          )}

          {actionType === 'add_device' && (
            <div className="space-y-3">
              <div>
                <label className="block text-slate-700 font-medium mb-1">نام دستگاه / آسانسور</label>
                <input 
                  type="text" 
                  value={formData.deviceName}
                  onChange={(e) => setFormData({...formData, deviceName: e.target.value})}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">تعداد توقف</label>
                  <input 
                    type="text" 
                    value={formData.stops}
                    onChange={(e) => setFormData({...formData, stops: e.target.value})}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">ظرفیت</label>
                  <input 
                    type="text" 
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                  />
                </div>
              </div>
            </div>
          )}

          {actionType === 'edit_reps' && (
            <div className="space-y-3">
              <div>
                <label className="block text-slate-700 font-medium mb-1">نام نماینده / مدیر ساختمان</label>
                <input 
                  type="text" 
                  value={formData.representativeName}
                  onChange={(e) => setFormData({...formData, representativeName: e.target.value})}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">شماره تماس همراه</label>
                <input 
                  type="text" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl"
                />
              </div>
            </div>
          )}

          {!actionType.includes('print') && actionType !== 'add_device' && actionType !== 'edit_reps' && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-800 text-sm block">{title}</span>
              <p className="text-slate-600">اطلاعات مربوط به {contract.buildingName} بررسی و تایید شده است.</p>
              <ul className="text-slate-500 space-y-1 list-disc list-inside mt-2">
                <li>مبلغ کل: {contract.totalPayable.toLocaleString('fa-IR')} ریال</li>
                <li>مسئول هماهنگی: {contract.coordinator}</li>
                <li>تاریخ شروع: {contract.startDate}</li>
              </ul>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition"
            >
              بستن
            </button>
            {!actionType.includes('print') && (
              <button 
                type="submit"
                className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold shadow transition flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>ذخیره تغییرات</span>
              </button>
            )}
          </div>

        </form>

      </div>
    </div>
  );
};
