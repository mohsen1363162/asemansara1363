import React, { useState } from 'react';
import { X, RefreshCw, Calendar, DollarSign, CheckCircle2 } from 'lucide-react';
import { Contract } from '../../types';

interface RenewContractModalProps {
  contract: Contract;
  onClose: () => void;
  onRenew: (newAmount: number, newEndDate: string) => void;
}

export const RenewContractModal: React.FC<RenewContractModalProps> = ({ contract, onClose, onRenew }) => {
  const [amount, setAmount] = useState(contract.totalPayable.toString());
  const [endDate, setEndDate] = useState('1407/05/01');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRenew(parseInt(amount.replace(/,/g, ''), 10), endDate);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200">
        
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base">تمدید قرارداد {contract.contractNumber}</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>قرارداد با موفقیت تمدید شد.</span>
            </div>
          )}

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-slate-500 block mb-1">ساختمان و مشتری</span>
            <strong className="text-slate-900 text-sm block">{contract.buildingName} ({contract.customerName})</strong>
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">مبلغ قرارداد جدید (ریال)</label>
            <div className="relative">
              <DollarSign className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pr-9 pl-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              <span>تاریخ پایان جدید قرارداد</span>
            </label>
            <input 
              type="text" 
              required
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500 font-mono"
            />
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
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow transition flex items-center gap-1.5"
            >
              <RefreshCw className="w-4 h-4" />
              <span>ثبت تمدید قرارداد</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
