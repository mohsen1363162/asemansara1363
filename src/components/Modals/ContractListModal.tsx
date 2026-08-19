import React from 'react';
import { X, FileText, Building2, ChevronLeft, Plus } from 'lucide-react';
import { Contract } from '../../types';

interface ContractListModalProps {
  contracts: Contract[];
  currentContractId: string;
  onSelectContract: (contract: Contract) => void;
  onCreateNewContract: () => void;
  onClose: () => void;
}

export const ContractListModal: React.FC<ContractListModalProps> = ({ contracts, currentContractId, onSelectContract, onCreateNewContract, onClose }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200">
        
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base">لیست قراردادهای سرویس و نگهداری</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-3 text-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500">برای مشاهده جزئیات کامل روی هر قرارداد کلیک کنید:</span>
            <button 
              onClick={onCreateNewContract}
              className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1 transition shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>افزودن قرارداد جدید</span>
            </button>
          </div>

          <div className="space-y-2">
            {contracts.map((c) => {
              const isSelected = c.id === currentContractId;
              return (
                <div 
                  key={c.id}
                  onClick={() => { onSelectContract(c); onClose(); }}
                  className={`p-4 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                    isSelected ? 'bg-amber-50/70 border-amber-500 shadow-xs' : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${isSelected ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-700'}`}>
                      {c.contractNumber}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-slate-400" />
                        <span>{c.buildingName}</span>
                        {isSelected && <span className="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded">در حال مشاهده</span>}
                      </div>
                      <div className="text-slate-500 text-[11px] mt-1">مشتری: {c.customerName} | نوع: {c.contractType}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="font-mono font-bold text-slate-900 block">{c.totalPayable.toLocaleString('fa-IR')} ریال</span>
                      <span className="text-slate-400 text-[10px]">{c.startDate} تا {c.endDate}</span>
                    </div>
                    <ChevronLeft className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button 
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-900 text-white px-5 py-2 rounded-xl text-xs font-medium transition"
          >
            بستن
          </button>
        </div>

      </div>
    </div>
  );
};
