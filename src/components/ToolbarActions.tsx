import React from 'react';
import { 
  Printer, 
  CreditCard, 
  FileSpreadsheet, 
  ShieldAlert, 
  FileText, 
  Edit3, 
  PlusCircle, 
  Users, 
  UserCheck, 
  FilePlus, 
  RefreshCw, 
  Trash2, 
  XCircle,
  FileCheck2
} from 'lucide-react';
import { Contract } from '../types';

interface ToolbarActionsProps {
  contract: Contract;
  isDarkMode: boolean;
  onActionClick: (actionType: string) => void;
}

export const ToolbarActions: React.FC<ToolbarActionsProps> = ({ contract: _contract, isDarkMode, onActionClick }) => {
  return (
    <div className={`${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'} border-b px-4 py-3 select-none flex flex-col gap-3 transition-colors duration-300`}>
      {/* Top Action Row: Renew, Terminate, Delete */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          {/* Renew Button (Green) */}
          <button 
            onClick={() => onActionClick('renew')}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition hover:shadow"
          >
            <RefreshCw className="w-4 h-4" />
            <span>تمدید قرارداد</span>
          </button>

          {/* Terminate Button */}
          <button 
            onClick={() => onActionClick('terminate')}
            className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition hover:shadow"
          >
            <XCircle className="w-4 h-4" />
            <span>فسخ قرارداد</span>
          </button>

          {/* Delete Button (Red) */}
          <button 
            onClick={() => onActionClick('delete')}
            className="flex items-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition"
          >
            <Trash2 className="w-4 h-4" />
            <span>حذف قرارداد</span>
          </button>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-slate-600 font-medium">وضعیت قرارداد:</span>
          <span className="text-emerald-700 font-bold">فعال و در حال اجرا</span>
        </div>
      </div>

      {/* Two Rows of Toolbars matching the screenshot */}
      <div className="flex flex-col gap-2 text-[11px]">
        
        {/* Row 1 of Toolbar items */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button 
            onClick={() => onActionClick('print_history')}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-300 transition shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-purple-600" />
            <span>چاپ تاریخچه قرارداد</span>
          </button>

          <button 
            onClick={() => onActionClick('print_kardex')}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-300 transition shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-purple-600" />
            <span>چاپ کاردکس قرارداد</span>
          </button>

          <button 
            onClick={() => onActionClick('payments')}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-300 transition shadow-xs"
          >
            <CreditCard className="w-3.5 h-3.5 text-blue-600" />
            <span>پرداختی‌ها</span>
          </button>

          <button 
            onClick={() => onActionClick('print_invoices')}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-300 transition shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-indigo-600" />
            <span>چاپ فاکتور سرویس‌ها</span>
          </button>

          <button 
            onClick={() => onActionClick('contract_file')}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-300 transition shadow-xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>پرونده مالی قرارداد</span>
          </button>

          <button 
            onClick={() => onActionClick('customer_file')}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-300 transition shadow-xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>پرونده مالی مشتری</span>
          </button>

          <button 
            onClick={() => onActionClick('building_file')}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-300 transition shadow-xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>پرونده مالی ساختمان</span>
          </button>
        </div>

        {/* Row 2 of Toolbar items */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button 
            onClick={() => onActionClick('guarantees')}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-300 transition shadow-xs"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            <span>ضمانت‌نامه‌ها</span>
          </button>

          <button 
            onClick={() => onActionClick('proforma')}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-300 transition shadow-xs"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-600" />
            <span>پیش‌فاکتور / فاکتورها</span>
          </button>

          <button 
            onClick={() => onActionClick('insurance')}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-300 transition shadow-xs"
          >
            <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>مفاصاحساب بیمه</span>
          </button>

          <button 
            onClick={() => onActionClick('edit_contract')}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-300 transition shadow-xs"
          >
            <Edit3 className="w-3.5 h-3.5 text-blue-600" />
            <span>ویرایش قرارداد</span>
          </button>

          <button 
            onClick={() => onActionClick('add_device')}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-300 transition shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>افزودن دستگاه</span>
          </button>

          <button 
            onClick={() => onActionClick('edit_reps')}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-300 transition shadow-xs"
          >
            <Users className="w-3.5 h-3.5 text-purple-600" />
            <span>ویرایش نمایندگان</span>
          </button>

          <button 
            onClick={() => onActionClick('resident_tech')}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-300 transition shadow-xs"
          >
            <UserCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>سرویس‌کار مقیم</span>
          </button>

          <button 
            onClick={() => onActionClick('addendums')}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-300 transition shadow-xs"
          >
            <FilePlus className="w-3.5 h-3.5 text-indigo-600" />
            <span>الحاقیه‌ها</span>
          </button>

          <button 
            onClick={() => onActionClick('settings_parts')}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-300 transition shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>تنظیمات قطعات</span>
          </button>
        </div>

      </div>
    </div>
  );
};
