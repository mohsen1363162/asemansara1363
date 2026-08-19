import React, { useEffect, useState } from 'react';
import { X, CreditCard, Plus, DollarSign, CheckCircle2 } from 'lucide-react';
import { PaymentRecord, Contract, ServiceMonth } from '../../types';

interface PaymentModalProps {
  contract: Contract;
  payments: PaymentRecord[];
  selectedMonth?: ServiceMonth | null;
  defaultAmount?: number;
  onClose: () => void;
  onAddPayment: (payment: PaymentRecord) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ contract, payments, selectedMonth, defaultAmount, onClose, onAddPayment }) => {
  const [amount, setAmount] = useState(defaultAmount ? String(defaultAmount) : '');
  const [receiptNumber, setReceiptNumber] = useState('');
  const [method, setMethod] = useState('کارتخوان / پوز بانکی');
  const [description, setDescription] = useState(selectedMonth ? `پرداخت بابت سرویس ماه ${selectedMonth.monthName} ${selectedMonth.year}` : '');
  const [successMsg, setSuccessMsg] = useState(false);

  useEffect(() => {
    setAmount(defaultAmount ? String(defaultAmount) : '');
    setDescription(selectedMonth ? `پرداخت بابت سرویس ماه ${selectedMonth.monthName} ${selectedMonth.year}` : '');
    setReceiptNumber('');
  }, [defaultAmount, selectedMonth]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    const newPayment: PaymentRecord = {
      id: 'p-' + Date.now(),
      date: '1405/05/' + Math.floor(Math.random() * 25 + 1),
      amount: parseInt(amount.replace(/,/g, ''), 10),
      receiptNumber: receiptNumber || 'REC-' + Math.floor(Math.random() * 9000 + 1000),
      method,
      description: description || 'پرداخت بابت سرویس و نگهداری'
    };

    onAddPayment(newPayment);
    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      setAmount('');
      setReceiptNumber('');
      setDescription('');
    }, 2000);
  };

  const formatRials = (val: number) => val.toLocaleString('fa-IR') + ' ریال';

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-base">مدیریت پرداختی‌های قرارداد {contract.contractNumber}</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[80vh] overflow-y-auto space-y-6">
          
          {/* Financial summary banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 grid grid-cols-3 gap-4 text-center text-xs">
            <div>
              <span className="text-slate-500 block mb-1">جمع قابل پرداخت</span>
              <strong className="text-slate-900 text-sm">{formatRials(contract.totalPayable)}</strong>
            </div>
            <div>
              <span className="text-slate-500 block mb-1">کل پرداختی</span>
              <strong className="text-blue-700 text-sm">{formatRials(contract.paidAmount)}</strong>
            </div>
            <div>
              <span className="text-slate-500 block mb-1">مانده بدهی</span>
              <strong className="text-rose-600 text-sm">{formatRials(contract.contractDebt)}</strong>
            </div>
          </div>

          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl flex items-center gap-2 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>پرداخت جدید با موفقیت ثبت شد و مانده حساب بروزرسانی گردید.</span>
            </div>
          )}

          {/* Add Payment Form */}
          <form onSubmit={handleSubmit} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
            <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>ثبت پرداختی جدید</span>
            </h4>

            {selectedMonth && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800 space-y-1">
                <div>مبلغ و توضیحات برای سرویس ماه <strong>{selectedMonth.monthName} {selectedMonth.year}</strong> به‌صورت خودکار وارد شده است. فقط تایید کنید.</div>
                <div className="text-emerald-900 font-semibold">این مبلغ شامل هزینه سرویس، قطعات ثبت‌شده و هزینه‌های اضافه این ماه است.</div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">مبلغ پرداختی (ریال)</label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="مثال: 1,000,000" 
                    className="w-xl pr-9 pl-3 py-2 bg-white rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">شماره فیش / پیگیری</label>
                <input 
                  type="text" 
                  value={receiptNumber}
                  onChange={(e) => setReceiptNumber(e.target.value)}
                  placeholder="مثال: 984521" 
                  className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">نحوه پرداخت</label>
                <select 
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500"
                >
                  <option value="کارتخوان / پوز بانکی">کارتخوان / پوز بانکی</option>
                  <option value="کارت به کارت / انتقال اینترنتی">کارت به کارت / انتقال اینترنتی</option>
                  <option value="چک بانکی">چک بانکی</option>
                  <option value="نقدی">نقدی</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">توضیحات</label>
                <input 
                  type="text" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="بابت قسط..." 
                  className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-xs font-semibold shadow transition"
              >
                ثبت و واریز به حساب
              </button>
            </div>
          </form>

          {/* Existing Payments List */}
          <div>
            <h4 className="font-bold text-slate-800 text-xs mb-3">سوابق واریزی‌های انجام شده</h4>
            <div className="space-y-2">
              {payments.map((p) => (
                <div key={p.id} className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900 text-sm font-mono">{formatRials(p.amount)}</div>
                    <div className="text-slate-500 text-[11px] mt-0.5">تاریخ: {p.date} | روش: {p.method} | فیش: {p.receiptNumber}</div>
                    <div className="text-slate-600 text-[11px] mt-1">{p.description}</div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 font-medium rounded-lg text-[11px]">
                    تایید شده
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button 
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-900 text-white px-5 py-2 rounded-xl text-xs font-medium transition"
          >
            بستن پنجره
          </button>
        </div>

      </div>
    </div>
  );
};
