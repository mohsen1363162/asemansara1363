import React, { useState } from 'react';
import { 
  FileText, 
  DollarSign, 
  CreditCard, 
  AlertCircle, 
  Building2, 
  UserCheck, 
  ChevronDown, 
  ChevronUp,
  ShieldCheck,
  Calendar,
  Layers
} from 'lucide-react';
import { Contract } from '../types';

interface ContractSummaryProps {
  contract: Contract;
  isDarkMode: boolean;
}

export const ContractSummary: React.FC<ContractSummaryProps> = ({ contract, isDarkMode }) => {
  const [showMore, setShowMore] = useState(false);

  const formatRials = (amount: number) => {
    return amount.toLocaleString('fa-IR') + ' ریال';
  };

  return (
    <div className={`${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'} border-b shadow-xs transition-colors duration-300`}>
      {/* Top Financial & Info Cards Bar matching the screenshot */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-px bg-slate-200 p-px text-xs">
        
        {/* 1. Contract Number */}
        <div className="bg-white p-3 flex flex-col justify-between hover:bg-slate-50 transition">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="font-medium">شماره قرارداد</span>
            <FileText className="w-4 h-4 text-amber-600" />
          </div>
          <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            {contract.contractNumber}
          </div>
        </div>

        {/* 2. Total Payable */}
        <div className="bg-white p-3 flex flex-col justify-between hover:bg-slate-50 transition">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="font-medium">جمع مبلغ قابل پرداخت</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-bold text-slate-900 mt-1 truncate" title={formatRials(contract.totalPayable)}>
            {formatRials(contract.totalPayable)}
          </div>
        </div>

        {/* 3. Paid */}
        <div className="bg-white p-3 flex flex-col justify-between hover:bg-slate-50 transition">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="font-medium">پرداختی</span>
            <CreditCard className="w-4 h-4 text-blue-600" />
          </div>
          <div className="font-bold text-blue-700 mt-1 truncate" title={formatRials(contract.paidAmount)}>
            {formatRials(contract.paidAmount)}
          </div>
        </div>

        {/* 4. Contract Debt Balance */}
        <div className="bg-white p-3 flex flex-col justify-between hover:bg-slate-50 transition">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="font-medium">مانده بدهی قرارداد</span>
            <AlertCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className={`font-bold mt-1 truncate ${contract.contractDebt > 0 ? 'text-rose-600' : 'text-slate-900'}`} title={formatRials(contract.contractDebt)}>
            {formatRials(contract.contractDebt)}
          </div>
        </div>

        {/* 5. Building Debt Balance */}
        <div className="bg-white p-3 flex flex-col justify-between hover:bg-slate-50 transition">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="font-medium">مانده بدهی ساختمان</span>
            <Building2 className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="font-bold text-slate-900 mt-1 truncate" title={formatRials(contract.buildingDebt)}>
            {formatRials(contract.buildingDebt)}
          </div>
        </div>

        {/* 6. Customer Balance */}
        <div className="bg-white p-3 flex flex-col justify-between hover:bg-slate-50 transition">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="font-medium">مانده مشتری</span>
            <UserCheck className="w-4 h-4 text-teal-600" />
          </div>
          <div className="font-bold text-slate-900 mt-1 truncate" title={formatRials(contract.customerBalance)}>
            {formatRials(contract.customerBalance)}
          </div>
        </div>

        {/* 7. Contract Type */}
        <div className="bg-white p-3 flex flex-col justify-between hover:bg-slate-50 transition">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="font-medium">نوع قرارداد</span>
            <Layers className="w-4 h-4 text-purple-600" />
          </div>
          <div className="font-semibold text-slate-800 text-[11px] mt-1 line-clamp-1" title={contract.contractType}>
            {contract.contractType}
          </div>
        </div>

        {/* 8. Coordinator */}
        <div className="bg-white p-3 flex flex-col justify-between hover:bg-slate-50 transition">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="font-medium">مسئول هماهنگی/مشتری</span>
            <UserCheck className="w-4 h-4 text-amber-600" />
          </div>
          <div className="font-semibold text-slate-800 text-[11px] mt-1 line-clamp-1" title={contract.coordinator}>
            {contract.coordinator}
          </div>
        </div>

      </div>

      {/* Expand More Details Toggle */}
      <div className="px-4 py-1.5 bg-slate-50 flex flex-col items-center border-t border-slate-200">
        <button 
          onClick={() => setShowMore(!showMore)}
          className="flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-amber-600 transition py-0.5"
        >
          <span>{showMore ? 'بستن جزئیات بیشتر' : 'مشاهده بیشتر'}</span>
          {showMore ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showMore && (
          <div className="w-full pt-3 pb-2 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-700 animate-fadeIn border-t border-slate-200 mt-2">
            <div className="bg-slate-100 p-2.5 rounded-lg">
              <span className="font-bold text-slate-900 block mb-1">اطلاعات ساختمان و آدرس</span>
              <p>ساختمان: <span className="font-medium text-slate-800">{contract.buildingName}</span></p>
              <p>مشتری: <span className="font-medium text-slate-800">{contract.customerName}</span></p>
              <p className="mt-1 text-slate-600 truncate">آدرس: {contract.address}</p>
            </div>

            <div className="bg-slate-100 p-2.5 rounded-lg">
              <span className="font-bold text-slate-900 block mb-1">مشخصات فنی آسانسور / تجهیزات</span>
              <p>تعداد دستگاه: <span className="font-medium text-slate-800">{contract.deviceCount} دستگاه ({contract.elevatorSpecs.stops} توقف)</span></p>
              <p>ظرفیت: <span className="font-medium text-slate-800">{contract.elevatorSpecs.capacity}</span></p>
              <p>نوع سیستم: <span className="font-medium text-slate-800">{contract.elevatorSpecs.type} - {contract.elevatorSpecs.motorType}</span></p>
            </div>

            <div className="bg-slate-100 p-2.5 rounded-lg">
              <span className="font-bold text-slate-900 block mb-1">تاریخ معتبر قرارداد و بیمه</span>
              <p className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-amber-600" /> شروع: {contract.startDate}</p>
              <p className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-emerald-600" /> پایان: {contract.endDate}</p>
              <p className="flex items-center gap-1 mt-1 text-emerald-700 font-medium"><ShieldCheck className="w-3.5 h-3.5" /> بیمه‌نامه مسئولیت فعال و معتبر</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
