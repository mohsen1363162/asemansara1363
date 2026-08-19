import React from 'react';
import { Building2, FileText, Package, ArrowRight } from 'lucide-react';
import { Contract } from '../types';

interface OtherViewsProps {
  section: string;
  contracts: Contract[];
  onBackToService: () => void;
  onSelectContract: (c: Contract) => void;
}

export const OtherViews: React.FC<OtherViewsProps> = ({ section, contracts, onBackToService, onSelectContract }) => {
  const titles: Record<string, { title: string; desc: string }> = {
    marketing: { title: 'بخش بازاریابی و جذب مشتریان جدید', desc: 'مدیریت سر1ها، پیگیری‌های فروش و معرفی خدمات سرویس آسانسور' },
    sales: { title: 'مدیریت فروش و قراردادهای جدید', desc: 'ثبت قراردادهای جدید سرویس و نگهداری، صدور پیش‌فاکتور' },
    installation: { title: 'نصب و راه‌اندازی تجهیزات و آسانسور', desc: 'پیگیری پروژه‌های در حال نصب، تحویل موقت و دائم' },
    servicenegar: { title: 'سیستم هوشمند سرویس‌نگار', desc: 'گزارش‌گیری پیشرفته از عملکرد سرویس‌کاران و رضایت مشتریان' },
    cartable: { title: 'کارتابل وظایف و درخواست‌های من', desc: 'نامه‌ها، تیکت‌های خرابی ارجاع شده و پیگیری‌های روزانه' },
    case: { title: 'پرونده‌های جامع ساختمان‌ها و مشتریان', desc: 'آرشیو الکترونیک اسناد، نقشه‌های فنی و سوابق تعمیرات' },
    warehouse: { title: 'انبار قطعات یدکی و تجهیزات', desc: 'موجودی قطعات موتور، سیم‌بکسل، روغن، درب و شستی' },
    financial: { title: 'مالی و حسابداری جامع', desc: 'گزارش‌های درآمد، بدهکاران، چک‌های دریافتی و صدور فاکتور رسمی' }
  };

  const info = titles[section] || { title: 'بخش مدیریت سیستم', desc: 'امکانات تخصصی سامانه سرویس و نگهداری' };

  return (
    <div className="flex-1 bg-slate-100 p-6 overflow-y-auto select-none">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Top Header */}
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{info.title}</h2>
            <p className="text-xs text-slate-500 mt-1">{info.desc}</p>
          </div>
          <button 
            onClick={onBackToService}
            className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow transition"
          >
            <ArrowRight className="w-4 h-4" />
            <span>بازگشت به داشبورد قرارداد</span>
          </button>
        </div>

        {/* Content Body */}
        {section === 'sales' || section === 'financial' ? (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 text-sm">لیست قراردادهای فعال سامانه</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {contracts.map((c) => (
                <div 
                  key={c.id} 
                  onClick={() => { onSelectContract(c); onBackToService(); }}
                  className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-amber-500 shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono bg-amber-100 text-amber-800 px-2.5 py-1 rounded-lg text-xs font-bold">قرارداد {c.contractNumber}</span>
                      <span className="text-emerald-700 text-xs font-medium bg-emerald-50 px-2 py-0.5 rounded">فعال</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 mt-2">
                      <Building2 className="w-4 h-4 text-slate-400" />
                      <span>{c.buildingName}</span>
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">مشتری: {c.customerName}</p>
                    <p className="text-xs text-slate-600 mt-2 font-mono font-bold">{c.totalPayable.toLocaleString('fa-IR')} ریال</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-amber-600 font-medium">
                    <span>مشاهده جزئیات و سرویس‌ها</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-4">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              {section === 'warehouse' ? <Package className="w-8 h-8" /> : <FileText className="w-8 h-8" />}
            </div>
            <h3 className="font-bold text-slate-900 text-base">{info.title}</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">{info.desc}</p>
            <div className="pt-2">
              <button 
                onClick={onBackToService}
                className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl text-xs font-semibold shadow transition"
              >
                بازگشت به قرارداد اصلی سرویس و نگهداری (شماره 5598)
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
