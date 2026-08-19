import { useEffect, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ContractSummary } from './components/ContractSummary';
import { ToolbarActions } from './components/ToolbarActions';
import { ServiceSchedule } from './components/ServiceSchedule';
import { Footer } from './components/Footer';
import { ManagementViews } from './components/ManagementViews';

// Modals
import { PaymentModal } from './components/Modals/PaymentModal';
import { ServiceDetailModal } from './components/Modals/ServiceDetailModal';
import { RenewContractModal } from './components/Modals/RenewContractModal';
import { ReportDowntimeModal } from './components/Modals/ReportDowntimeModal';
import { ContractListModal } from './components/Modals/ContractListModal';
import { GenericActionModal } from './components/Modals/GenericActionModal';
import { NewContractWizardModal } from './components/Modals/NewContractWizardModal';
import { PartsSettingsModal } from './components/Modals/PartsSettingsModal';
import { MonthPartsModal } from './components/Modals/MonthPartsModal';
import { CloudSyncPanel } from './components/CloudSyncPanel';
import { CloudBackupData, ensureBackupTableExistsHelp, loadBackupFromSupabase, saveBackupToSupabase } from './services/supabase';

// Initial Data
import { 
  initialContracts, 
  initialServiceMonths, 
  initialBreakdowns, 
  initialPayments, 
  initialDocuments, 
  initialChecklist,
  initialParts 
} from './data/mockData';

import { Contract, ServiceMonth, BreakdownRecord, PaymentRecord, DocumentItem, ChecklistItem, PartItem } from './types';

type ContractScopedData = {
  serviceMonths: ServiceMonth[];
  breakdowns: BreakdownRecord[];
  payments: PaymentRecord[];
};

type AppBackupData = {
  version: string;
  exportedAt: string;
  isDarkMode: boolean;
  contracts: Contract[];
  currentContractId: string;
  activeSection: string;
  contractDataMap: Record<string, ContractScopedData>;
  parts: PartItem[];
};

const STORAGE_KEYS = {
  darkMode: 'service-app-dark-mode',
  contracts: 'service-app-contracts',
  currentContractId: 'service-app-current-contract-id',
  contractDataMap: 'service-app-contract-data-map',
  parts: 'service-app-parts',
  activeSection: 'service-app-active-section',
};

export function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [contracts, setContracts] = useState<Contract[]>(initialContracts);
  const [currentContract, setCurrentContract] = useState<Contract>(initialContracts[0]!);
  const [activeSection, setActiveSection] = useState<string>('service');

  const [contractDataMap, setContractDataMap] = useState<Record<string, ContractScopedData>>({
    '1': {
      serviceMonths: initialServiceMonths,
      breakdowns: initialBreakdowns,
      payments: initialPayments,
    },
    '2': {
      serviceMonths: initialServiceMonths.map((m, index) => ({
        ...m,
        id: `c2-${m.id}`,
        status: index === 0 ? 'completed' : 'scheduled',
        notes: index === 0 ? 'سرویس اولیه مجتمع تجاری نگین انجام شد.' : 'برنامه‌ریزی شده',
        usedParts: [],
        extraServiceCost: 0,
      })),
      breakdowns: [],
      payments: [],
    },
    '3': {
      serviceMonths: initialServiceMonths.map((m, index) => ({
        ...m,
        id: `c3-${m.id}`,
        status: index < 2 ? 'completed' : 'scheduled',
        notes: index < 2 ? 'سرویس انجام شده برای ساختمان پزشکان پارس' : 'برنامه‌ریزی شده',
        usedParts: [],
        extraServiceCost: 0,
      })),
      breakdowns: [],
      payments: [],
    },
  });
  const [documents] = useState<DocumentItem[]>(initialDocuments);
  const [checklist] = useState<ChecklistItem[]>(initialChecklist);
  const [parts, setParts] = useState<PartItem[]>(initialParts);

  // Modal control states
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<ServiceMonth | null>(null);
  const [selectedPaymentMonth, setSelectedPaymentMonth] = useState<ServiceMonth | null>(null);
  const [selectedPaymentAmount, setSelectedPaymentAmount] = useState<number | undefined>(undefined);
  const [genericModalData, setGenericModalData] = useState<{ title: string; type: string } | null>(null);
  const [cloudSyncStatus, setCloudSyncStatus] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const savedDarkMode = window.localStorage.getItem(STORAGE_KEYS.darkMode);
      const savedContracts = window.localStorage.getItem(STORAGE_KEYS.contracts);
      const savedContractDataMap = window.localStorage.getItem(STORAGE_KEYS.contractDataMap);
      const savedParts = window.localStorage.getItem(STORAGE_KEYS.parts);
      const savedCurrentContractId = window.localStorage.getItem(STORAGE_KEYS.currentContractId);
      const savedActiveSection = window.localStorage.getItem(STORAGE_KEYS.activeSection);

      if (savedDarkMode !== null) {
        setIsDarkMode(JSON.parse(savedDarkMode));
      }
      if (savedContracts) {
        const parsedContracts = JSON.parse(savedContracts);
        if (Array.isArray(parsedContracts) && parsedContracts.length > 0) {
          setContracts(parsedContracts);
          if (savedCurrentContractId) {
            const found = parsedContracts.find((c: Contract) => c.id === savedCurrentContractId);
            if (found) setCurrentContract(found);
          }
        }
      }
      if (savedContractDataMap) {
        const parsedContractDataMap = JSON.parse(savedContractDataMap);
        if (parsedContractDataMap && typeof parsedContractDataMap === 'object') {
          setContractDataMap(parsedContractDataMap);
        }
      }
      if (savedParts) {
        const parsedParts = JSON.parse(savedParts);
        if (Array.isArray(parsedParts)) {
          setParts(parsedParts);
        }
      }
      if (savedActiveSection) {
        setActiveSection(savedActiveSection);
      }
    } catch (error) {
      console.error('خطا در بارگذاری اطلاعات ذخیره‌شده:', error);
      try {
        window.localStorage.removeItem(STORAGE_KEYS.darkMode);
        window.localStorage.removeItem(STORAGE_KEYS.contracts);
        window.localStorage.removeItem(STORAGE_KEYS.contractDataMap);
        window.localStorage.removeItem(STORAGE_KEYS.parts);
        window.localStorage.removeItem(STORAGE_KEYS.currentContractId);
        window.localStorage.removeItem(STORAGE_KEYS.activeSection);
      } catch (resetError) {
        console.error('خطا در پاکسازی localStorage خراب:', resetError);
      }
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.darkMode, JSON.stringify(isDarkMode));
    } catch (error) {
      console.error('خطا در ذخیره حالت نمایش:', error);
    }
  }, [isDarkMode]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.contracts, JSON.stringify(contracts));
    } catch (error) {
      console.error('خطا در ذخیره قراردادها:', error);
    }
  }, [contracts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.contractDataMap, JSON.stringify(contractDataMap));
    } catch (error) {
      console.error('خطا در ذخیره داده‌های قراردادها:', error);
    }
  }, [contractDataMap]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.parts, JSON.stringify(parts));
    } catch (error) {
      console.error('خطا در ذخیره قطعات:', error);
    }
  }, [parts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.currentContractId, currentContract.id);
    } catch (error) {
      console.error('خطا در ذخیره قرارداد فعلی:', error);
    }
  }, [currentContract]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.activeSection, activeSection);
    } catch (error) {
      console.error('خطا در ذخیره بخش فعال:', error);
    }
  }, [activeSection]);

  const exportAllData = () => {
    const backupData: AppBackupData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      isDarkMode,
      contracts,
      currentContractId: currentContract.id,
      activeSection,
      contractDataMap,
      parts,
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `service-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const restoreBackupData = (parsed: AppBackupData) => {
    if (!parsed.contracts || !parsed.contractDataMap || !parsed.parts) {
      throw new Error('فایل بکاپ معتبر نیست.');
    }

    setIsDarkMode(Boolean(parsed.isDarkMode));
    setContracts(parsed.contracts);
    setContractDataMap(parsed.contractDataMap);
    setParts(parsed.parts);
    setActiveSection(parsed.activeSection || 'service');

    const restoredCurrent = parsed.contracts.find((c) => c.id === parsed.currentContractId) || parsed.contracts[0];
    if (restoredCurrent) {
      setCurrentContract(restoredCurrent);
    }
  };

  const importAllData = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as AppBackupData;
        restoreBackupData(parsed);
        alert('بکاپ با موفقیت بازیابی شد.');
      } catch (error) {
        console.error(error);
        alert('خطا در بازیابی فایل بکاپ.');
      }
    };
    reader.readAsText(file);
  };

  const saveBackupToCloudHandler = async () => {
    try {
      const backupData: CloudBackupData = {
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        isDarkMode,
        contracts,
        currentContractId: currentContract.id,
        activeSection,
        contractDataMap,
        parts,
      };
      await saveBackupToSupabase(backupData);
      setCloudSyncStatus('✅ اطلاعات با موفقیت در فضای ابری ذخیره شد. حالا روی هر دستگاه دیگری هم می‌توانید بازیابی کنید.');
    } catch (error) {
      console.error(error);
      setCloudSyncStatus('❌ ذخیره ابری انجام نشد. احتمالاً جدول app_backups هنوز در Supabase ساخته نشده یا دسترسی آن کامل نیست.');
    }
  };

  const loadBackupFromCloudHandler = async () => {
    try {
      const backup = await loadBackupFromSupabase();
      if (!backup) {
        setCloudSyncStatus('ℹ️ هنوز هیچ نسخه‌ای در فضای ابری ذخیره نشده است. اول یک بار ذخیره ابری را بزنید.');
        return;
      }
      restoreBackupData(backup as AppBackupData);
      setCloudSyncStatus('✅ اطلاعات با موفقیت از فضای ابری بازیابی شد.');
    } catch (error) {
      console.error(error);
      setCloudSyncStatus('❌ بازیابی ابری انجام نشد. احتمالاً جدول app_backups هنوز ساخته نشده یا دسترسی آن کامل نیست.');
    }
  };

  const currentData = contractDataMap[currentContract.id] || {
    serviceMonths: initialServiceMonths,
    breakdowns: initialBreakdowns,
    payments: initialPayments,
  };

  const serviceMonths = currentData.serviceMonths;
  const breakdowns = currentData.breakdowns;
  const payments = currentData.payments;

  const updateCurrentContractData = (patch: Partial<ContractScopedData>) => {
    setContractDataMap((prev) => ({
      ...prev,
      [currentContract.id]: {
        ...(prev[currentContract.id] ?? { serviceMonths: [], breakdowns: [], payments: [] }),
        ...patch,
      } as ContractScopedData,
    }));
  };

  const syncContractEverywhere = (updatedContract: Contract) => {
    setCurrentContract(updatedContract);
    setContracts((prev) => prev.map((c) => (c.id === updatedContract.id ? updatedContract : c)));
  };

  // Handlers
  const handleAddPayment = (newPay: PaymentRecord) => {
    updateCurrentContractData({ payments: [newPay, ...payments] });
    const updatedPaid = currentContract.paidAmount + newPay.amount;
    const remainingDebt = Math.max(0, currentContract.buildingDebt - newPay.amount);
    
    const updatedContract = {
      ...currentContract,
      paidAmount: updatedPaid,
      buildingDebt: remainingDebt,
      contractDebt: remainingDebt,
    };
    syncContractEverywhere(updatedContract);
  };

  const getMonthExtraTotal = (month: ServiceMonth) => {
    const partsTotal = (month.usedParts || []).filter((item) => item.includeInInvoice).reduce((sum, item) => sum + item.totalPrice, 0);
    return partsTotal + (month.extraServiceCost || 0);
  };

  const handleUpdateMonth = (updated: ServiceMonth) => {
    const oldMonth = serviceMonths.find((m) => m.id === updated.id);
    updateCurrentContractData({
      serviceMonths: serviceMonths.map((m) => (m.id === updated.id ? updated : m)),
    });

    const oldTotal = oldMonth ? getMonthExtraTotal(oldMonth) : 0;
    const newTotal = getMonthExtraTotal(updated);
    const extrasDiff = newTotal - oldTotal;
    const serviceCompletionCharge = oldMonth?.status !== 'completed' && updated.status === 'completed' ? currentContract.nextServiceAmount : 0;
    const totalAddedDebt = serviceCompletionCharge + extrasDiff;

    if (totalAddedDebt !== 0) {
      const newBuildingDebt = Math.max(0, currentContract.buildingDebt + totalAddedDebt);
      const updatedContract = {
        ...currentContract,
        buildingDebt: newBuildingDebt,
        contractDebt: newBuildingDebt,
      };
      syncContractEverywhere(updatedContract);
    }
  };

  const handleRenewContract = (newAmount: number, newEndDate: string) => {
    const updated = {
      ...currentContract,
      totalPayable: newAmount,
      endDate: newEndDate,
      contractDebt: newAmount - currentContract.paidAmount
    };
    setCurrentContract(updated);
    setContracts(contracts.map(c => c.id === updated.id ? updated : c));
  };

  const handleAddBreakdown = (rec: BreakdownRecord) => {
    updateCurrentContractData({ breakdowns: [rec, ...breakdowns] });

    const firstScheduledMonth = serviceMonths.find((m) => m.status === 'scheduled' || m.status === 'pending');
    if (firstScheduledMonth) {
      updateCurrentContractData({
        serviceMonths: serviceMonths.map((m) =>
          m.id === firstScheduledMonth.id
            ? {
                ...m,
                status: 'in_progress',
                notes: rec.description,
                technician: rec.technician,
              }
            : m
        ),
      });
    }
  };

  const handleToolbarAction = (actionType: string) => {
    switch (actionType) {
      case 'renew':
        setActiveModal('renew');
        break;
      case 'terminate':
        alert(`قرارداد ${currentContract.contractNumber} با موفقیت فسخ گردید.`);
        break;
      case 'delete':
        if (confirm(`آیا از حذف قرارداد ${currentContract.contractNumber} اطمینان دارید؟`)) {
          alert('قرارداد حذف شد.');
        }
        break;
      case 'payments':
        setActiveModal('payment');
        break;
      case 'print_history':
        setGenericModalData({ title: 'چاپ تاریخچه قرارداد', type: 'print_history' });
        setActiveModal('generic');
        break;
      case 'print_kardex':
        setGenericModalData({ title: 'چاپ کاردکس قرارداد', type: 'print_kardex' });
        setActiveModal('generic');
        break;
      case 'print_invoices':
        setGenericModalData({ title: 'چاپ فاکتور سرویس‌ها', type: 'print_invoices' });
        setActiveModal('generic');
        break;
      case 'contract_file':
      case 'customer_file':
      case 'building_file':
        setGenericModalData({ title: 'پرونده مالی و حسابداری', type: 'financial_file' });
        setActiveModal('generic');
        break;
      case 'guarantees':
        setGenericModalData({ title: 'ضمانت‌نامه‌ها و اوراق بهادار', type: 'guarantees' });
        setActiveModal('generic');
        break;
      case 'proforma':
        setGenericModalData({ title: 'پیش‌فاکتور و فاکتورهای رسمی', type: 'proforma' });
        setActiveModal('generic');
        break;
      case 'insurance':
        setGenericModalData({ title: 'مفاصاحساب بیمه مسئولیت', type: 'insurance' });
        setActiveModal('generic');
        break;
      case 'edit_contract':
        setGenericModalData({ title: 'ویرایش مشخصات قرارداد', type: 'edit_contract' });
        setActiveModal('generic');
        break;
      case 'add_device':
        setGenericModalData({ title: 'افزودن دستگاه / آسانسور جدید', type: 'add_device' });
        setActiveModal('generic');
        break;
      case 'edit_reps':
        setGenericModalData({ title: 'ویرایش نمایندگان و مدیر ساختمان', type: 'edit_reps' });
        setActiveModal('generic');
        break;
      case 'resident_tech':
        setGenericModalData({ title: 'مدیریت سرویس‌کار مقیم', type: 'resident_tech' });
        setActiveModal('generic');
        break;
      case 'settings_parts':
        setActiveModal('parts_settings');
        break;
      case 'addendums':
        setGenericModalData({ title: 'الحاقیه‌ها و اصلاحیه قرارداد', type: 'addendums' });
        setActiveModal('generic');
        break;
      default:
        break;
    }
  };

  return (
    <div className={`flex h-screen overflow-hidden font-sans text-right transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-800'}`} dir="rtl">
      
      {/* Right Sidebar */}
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        <Header 
          currentContract={currentContract} 
          isDarkMode={isDarkMode}
          onToggleTheme={() => setIsDarkMode((prev) => !prev)}
          onOpenContractList={() => setActiveModal('contract_list')} 
          onExportBackup={() => {
            try {
              exportAllData();
            } catch (error) {
              console.error('خطا در خروجی بکاپ:', error);
              alert('خطا در تهیه بکاپ.');
            }
          }}
          onImportBackup={(file) => {
            try {
              importAllData(file);
            } catch (error) {
              console.error('خطا در ورود بکاپ:', error);
              alert('خطا در بازیابی بکاپ.');
            }
          }}
        />

        <div className={`px-4 py-3 border-b ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
          <CloudSyncPanel
            onSaveToCloud={saveBackupToCloudHandler}
            onLoadFromCloud={loadBackupFromCloudHandler}
            statusMessage={cloudSyncStatus}
            setupHint={ensureBackupTableExistsHelp}
          />
        </div>

        {activeSection !== 'service' ? (
          <div className={isDarkMode ? 'bg-slate-950 text-slate-100 flex-1 overflow-y-auto' : 'bg-slate-100 text-slate-800 flex-1 overflow-y-auto'}>
            <ManagementViews 
              section={activeSection} 
              contracts={contracts}
              parts={parts}
              isDarkMode={isDarkMode}
              onBackToService={() => setActiveSection('service')}
              onSelectContract={(c: Contract) => { setCurrentContract(c); setActiveSection('service'); }}
              onAddPart={(part) => setParts((prev) => [part, ...prev])}
              onUpdatePart={(part) => setParts((prev) => prev.map((p) => (p.id === part.id ? part : p)))}
              onAdjustPartStock={(id, amount) => setParts((prev) => prev.map((p) => p.id === id ? { ...p, stock: Math.max(0, p.stock + amount) } : p))}
            />
          </div>
        ) : (
          <main className={`flex-1 overflow-y-auto flex flex-col transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-800'}`}>
            
            {/* Top Contract Summary Cards */}
            <ContractSummary contract={currentContract} isDarkMode={isDarkMode} />

            {/* Toolbar & Action Buttons */}
            <ToolbarActions contract={currentContract} isDarkMode={isDarkMode} onActionClick={handleToolbarAction} />

            {/* Service Scheduling & Tabs Section */}
            <div className="p-4 flex-1">
              <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
                <ServiceSchedule 
                  serviceMonths={serviceMonths}
                  breakdowns={breakdowns}
                  documents={documents}
                  checklist={checklist}
                  nextServiceAmount={currentContract.nextServiceAmount}
                  paidAmount={currentContract.paidAmount}
                  contractDebt={currentContract.contractDebt}
                  isDarkMode={isDarkMode}
                  onSelectMonth={(m) => { setSelectedMonth(m); setActiveModal('service_detail'); }}
                  onAddNewService={() => alert('امکان افزودن اسلات سرویس جدید فعال است.')}
                  onReportDowntime={() => setActiveModal('downtime')}
                  onOpenChecklist={() => {}}
                  onOpenDocuments={() => {}}
                  onQuickPayment={() => {
                    setSelectedPaymentMonth(null);
                    setSelectedPaymentAmount(undefined);
                    setActiveModal('payment');
                  }}
                  onMonthPayment={(month) => {
                    setSelectedPaymentMonth(month);
                    setSelectedPaymentAmount(currentContract.nextServiceAmount + getMonthExtraTotal(month));
                    setActiveModal('payment');
                  }}
                />
              </div>
            </div>

            {/* Footer */}
            <Footer />

          </main>
        )}

      </div>

      {/* Modals */}
      {activeModal === 'payment' && (
        <PaymentModal 
          contract={currentContract} 
          payments={payments} 
          selectedMonth={selectedPaymentMonth}
          {...(selectedPaymentAmount !== undefined ? { defaultAmount: selectedPaymentAmount } : {})}
          onClose={() => {
            setActiveModal(null);
            setSelectedPaymentMonth(null);
            setSelectedPaymentAmount(undefined);
          }} 
          onAddPayment={handleAddPayment} 
        />
      )}

      {activeModal === 'service_detail' && selectedMonth && (
        <ServiceDetailModal 
          serviceMonth={selectedMonth} 
          onClose={() => { setActiveModal(null); setSelectedMonth(null); }} 
          onOpenParts={(month) => {
            setSelectedMonth(month);
            setActiveModal('month_parts');
          }}
          onUpdateMonth={handleUpdateMonth} 
        />
      )}

      {activeModal === 'renew' && (
        <RenewContractModal 
          contract={currentContract} 
          onClose={() => setActiveModal(null)} 
          onRenew={handleRenewContract} 
        />
      )}

      {activeModal === 'downtime' && (
        <ReportDowntimeModal 
          onClose={() => setActiveModal(null)} 
          onAddBreakdown={handleAddBreakdown} 
        />
      )}

      {activeModal === 'contract_list' && (
        <ContractListModal 
          contracts={contracts} 
          currentContractId={currentContract.id} 
          onSelectContract={(c) => setCurrentContract(c)} 
          onCreateNewContract={() => setActiveModal('new_contract')}
          onClose={() => setActiveModal(null)} 
        />
      )}

      {activeModal === 'new_contract' && (
        <NewContractWizardModal
          contracts={contracts}
          onClose={() => setActiveModal(null)}
          onCreateContract={(contract: Contract) => {
            setContracts((prev) => [contract, ...prev]);
            setContractDataMap((prev) => ({
              ...prev,
              [contract.id]: {
                serviceMonths: initialServiceMonths.map((m) => ({
                  ...m,
                  id: `${contract.id}-${m.id}-${Date.now()}`,
                  status: 'scheduled',
                  notes: 'برنامه‌ریزی شده',
                  usedParts: [],
                  extraServiceCost: 0,
                })),
                breakdowns: [],
                payments: [],
              },
            }));
            setCurrentContract(contract);
            setActiveModal(null);
            setActiveSection('service');
          }}
        />
      )}

      {activeModal === 'month_parts' && selectedMonth && (
        <MonthPartsModal
          month={selectedMonth}
          parts={parts}
          onClose={() => setActiveModal(null)}
          onSave={(updatedMonth) => handleUpdateMonth(updatedMonth)}
        />
      )}

      {activeModal === 'parts_settings' && (
        <PartsSettingsModal
          parts={parts}
          onClose={() => setActiveModal(null)}
          onAddPart={(part) => {
            setParts((prev) => [part, ...prev]);
          }}
          onUpdatePart={(part) => setParts((prev) => prev.map((p) => (p.id === part.id ? part : p)))}
          onAdjustStock={(id, amount) => setParts((prev) => prev.map((p) => p.id === id ? { ...p, stock: Math.max(0, p.stock + amount) } : p))}
        />
      )}

      {activeModal === 'generic' && genericModalData && (
        <GenericActionModal 
          title={genericModalData.title} 
          actionType={genericModalData.type} 
          contract={currentContract} 
          onClose={() => { setActiveModal(null); setGenericModalData(null); }} 
        />
      )}

    </div>
  );
}
export default App;
