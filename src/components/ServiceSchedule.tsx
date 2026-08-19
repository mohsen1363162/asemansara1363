import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Wrench, 
  Calendar as CalendarIcon, 
  CheckSquare, 
  FileText, 
  ShieldCheck, 
  Bell, 
  Clock, 
  Ban, 
  Plus, 
  CalendarDays,
  Printer,
  Edit,
  Trash2
} from 'lucide-react';
import { ServiceMonth, BreakdownRecord, DocumentItem, ChecklistItem } from '../types';

interface ServiceScheduleProps {
  serviceMonths: ServiceMonth[];
  breakdowns: BreakdownRecord[];
  documents: DocumentItem[];
  checklist: ChecklistItem[];
  nextServiceAmount: number;
  paidAmount: number;
  contractDebt: number;
  isDarkMode: boolean;
  onSelectMonth: (month: ServiceMonth) => void;
  onAddNewService: () => void;
  onReportDowntime: () => void;
  onOpenChecklist: () => void;
  onOpenDocuments: () => void;
  onQuickPayment: () => void;
  onMonthPayment: (month: ServiceMonth) => void;
}

export const ServiceSchedule: React.FC<ServiceScheduleProps> = ({
  serviceMonths,
  breakdowns,
  documents,
  checklist,
  nextServiceAmount,
  paidAmount,
  contractDebt,
  isDarkMode,
  onSelectMonth,
  onAddNewService,
  onReportDowntime,
  onOpenChecklist,
  onOpenDocuments,
  onQuickPayment,
  onMonthPayment,
}) => {
  const [activeTab, setActiveTab] = useState<'scheduling' | 'breakdowns' | 'services' | 'repair' | 'checklist' | 'documents' | 'insurance' | 'reminders' | 'downtime'>('scheduling');
  const [hoveredMonth, setHoveredMonth] = useState<ServiceMonth | null>(serviceMonths[0] || null);

  const formatRials = (amount: number) => {
    return amount.toLocaleString('fa-IR') + ' ریال';
  };

  const getMonthCardStyle = (status: ServiceMonth['status']) => {
    switch (status) {
      case 'completed':
        return {
          card: 'bg-emerald-500 text-white border-emerald-600 shadow-emerald-500/20',
          year: 'text-emerald-100',
          date: 'text-emerald-100',
          badge: 'bg-emerald-600/90 text-white',
          icon: 'done'
        };
      case 'in_progress':
        return {
          card: 'bg-amber-500 text-white border-amber-600 shadow-amber-500/20',
          year: 'text-amber-100',
          date: 'text-amber-100',
          badge: 'bg-amber-600/90 text-white',
          icon: 'progress'
        };
      default:
        return {
          card: 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200',
          year: 'text-slate-400',
          date: 'text-slate-500',
          badge: 'bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-700',
          icon: 'calendar'
        };
    }
  };

  const getStatusLabel = (status: ServiceMonth['status']) => {
    switch (status) {
      case 'completed':
        return 'انجام شده';
      case 'in_progress':
        return 'در حال انجام';
      case 'pending':
        return 'در انتظار تایید';
      case 'cancelled':
        return 'لغو شده';
      default:
        return 'برنامه‌ریزی شده';
    }
  };

  return (
    <div className={`${isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-800'} p-4 flex flex-col gap-4 select-none transition-colors duration-300`}>
      
      {/* Top Header of Schedule Section */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800 text-sm">مبلغ سرویس بعدی:</span>
          <span className="font-bold text-emerald-600 text-sm">{formatRials(nextServiceAmount)}</span>
        </div>

        {/* Action icons on top right */}
        <div className="flex items-center gap-2 text-slate-500">
          <button className="p-1.5 hover:bg-slate-100 rounded-lg transition" title="حذف گروهی">
            <Trash2 className="w-4 h-4 text-rose-500" />
          </button>
          <button className="p-1.5 hover:bg-slate-100 rounded-lg transition" title="ویرایش">
            <Edit className="w-4 h-4 text-blue-600" />
          </button>
          <button className="p-1.5 hover:bg-slate-100 rounded-lg transition" title="چاپ زمان‌بندی">
            <Printer className="w-4 h-4 text-purple-600" />
          </button>
          <span className="text-xs text-slate-600 font-medium px-2 py-1 bg-slate-100 rounded-lg">
            10 سرویس برنامه‌ریزی شده / بدون خرابی
          </span>
        </div>
      </div>

      {/* Navigation Tabs Bar matching screenshot */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-slate-100 text-xs">
        
        <button
          onClick={() => setActiveTab('breakdowns')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition whitespace-nowrap ${
            activeTab === 'breakdowns' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
          <span>خرابی‌ها ({breakdowns.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition whitespace-nowrap ${
            activeTab === 'services' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
          }`}
        >
          <Wrench className="w-3.5 h-3.5 text-blue-500" />
          <span>سرویس‌ها</span>
        </button>

        <button
          onClick={() => setActiveTab('repair')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition whitespace-nowrap ${
            activeTab === 'repair' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
          }`}
        >
          <Wrench className="w-3.5 h-3.5 text-amber-500" />
          <span>سرویس و تعمیر</span>
        </button>

        <button
          onClick={() => setActiveTab('scheduling')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition whitespace-nowrap ${
            activeTab === 'scheduling' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
          }`}
        >
          <CalendarDays className="w-3.5 h-3.5 text-emerald-600" />
          <span>زمان‌بندی سرویس‌ها</span>
        </button>

        <button
          onClick={() => { setActiveTab('checklist'); onOpenChecklist(); }}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition whitespace-nowrap ${
            activeTab === 'checklist' ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
          }`}
        >
          <CheckSquare className="w-3.5 h-3.5 text-purple-500" />
          <span>چک‌لیست اختصاصی ({checklist.length})</span>
        </button>

        <button
          onClick={() => { setActiveTab('documents'); onOpenDocuments(); }}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition whitespace-nowrap ${
            activeTab === 'documents' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-indigo-500" />
          <span>مستندات ({documents.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('insurance')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition whitespace-nowrap ${
            activeTab === 'insurance' ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-teal-500" />
          <span>بیمه</span>
        </button>

        <button
          onClick={() => setActiveTab('reminders')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition whitespace-nowrap ${
            activeTab === 'reminders' ? 'bg-orange-50 text-orange-700 border border-orange-200' : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
          }`}
        >
          <Bell className="w-3.5 h-3.5 text-orange-500" />
          <span>یادآوری‌ها</span>
        </button>

        <button
          onClick={() => setActiveTab('downtime')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition whitespace-nowrap ${
            activeTab === 'downtime' ? 'bg-slate-200 text-slate-800 border border-slate-300' : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-slate-600" />
          <span>تاریخچه توقف‌ها</span>
        </button>

        {/* Report Downtime Button (Red outline) */}
        <button
          onClick={onReportDowntime}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-300 transition whitespace-nowrap mr-auto shadow-xs"
        >
          <Ban className="w-3.5 h-3.5" />
          <span>اعلام توقف</span>
        </button>

      </div>

      {/* Conditional Tab Content */}
      {activeTab === 'scheduling' && (
        <div className="flex flex-col gap-3">
          <div className="text-xs text-slate-500 flex items-center justify-between">
            <span>برای مشاهده جزئیات، ویرایش یا ثبت وضعیت روی کارت هر ماه کلیک کنید.</span>
            <span className="text-emerald-600 font-medium">هر سرویسی که انجام شود به‌صورت سبز نمایش داده می‌شود</span>
          </div>

          {/* Monthly Cards Horizontal Scroll / Grid */}
          <div className="flex items-end gap-3 overflow-x-auto py-2 px-1">
            
            {/* Service Months */}
            {serviceMonths.map((m) => {
              const styles = getMonthCardStyle(m.status);
              const partsCount = m.usedParts?.length || 0;
              const partsTotal = (m.usedParts || []).filter((item) => item.includeInInvoice).reduce((sum, item) => sum + item.totalPrice, 0) + (m.extraServiceCost || 0);
              return (
                <div key={m.id} className="min-w-[110px] flex flex-col gap-2">
                  <div
                    onClick={() => onSelectMonth(m)}
                    onMouseEnter={() => setHoveredMonth(m)}
                    className={`rounded-xl p-3 flex flex-col items-center justify-between cursor-pointer transition-all duration-200 border shadow-xs hover:shadow-md group relative ${styles.card}`}
                  >
                    <div className="w-full flex items-center justify-between text-xs mb-2">
                      <span className={styles.year}>
                        {m.year}
                      </span>
                      {styles.icon === 'done' ? (
                        <div className="w-5 h-5 rounded-full bg-white text-emerald-600 flex items-center justify-center font-bold text-xs shadow">
                          ✓
                        </div>
                      ) : styles.icon === 'progress' ? (
                        <div className="w-5 h-5 rounded-full bg-white text-amber-600 flex items-center justify-center font-bold text-[10px] shadow">
                          ●
                        </div>
                      ) : (
                        <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </div>

                    <div className="text-center my-1">
                      <span className="font-bold text-sm block">{m.monthName}</span>
                      <span className={`text-[10px] ${styles.date}`}>
                        {m.jalaliDate}
                      </span>
                    </div>

                    <div className={`mt-2 w-full text-center py-1 rounded-md text-[10px] font-medium ${styles.badge}`}>
                      {getStatusLabel(m.status)}
                    </div>

                    {(partsCount > 0 || (m.extraServiceCost || 0) > 0) && (
                      <div className={`mt-2 w-full text-center py-1 rounded-md text-[10px] font-medium ${m.status === 'completed' ? 'bg-white/90 text-emerald-700' : 'bg-violet-50 text-violet-700'}`}>
                        {partsCount} قطعه / {partsTotal.toLocaleString('fa-IR')} ریال
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => onMonthPayment(m)}
                    className={`rounded-lg border px-2 py-1.5 text-[10px] font-semibold transition shadow-xs ${
                      m.status === 'completed'
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        : 'border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    ثبت سریع پرداخت
                  </button>
                </div>
              );
            })}

            {/* Empty Slots for Adding New Services */}
            {[1, 2].map((slot) => (
              <div key={`empty-${slot}`} className="min-w-[110px] flex flex-col gap-2">
                <div
                  onClick={onAddNewService}
                  className="h-[134px] rounded-xl p-3 border-2 border-dashed border-slate-300 hover:border-amber-500 bg-slate-50/50 hover:bg-amber-50/30 flex flex-col items-center justify-center cursor-pointer transition text-slate-400 hover:text-amber-600 group"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-200 group-hover:bg-amber-100 flex items-center justify-center transition mb-2">
                    <Plus className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-medium">سرویس جدید</span>
                </div>
                <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-2 py-1.5 text-[10px] text-center text-slate-400">
                  پرداخت
                </div>
              </div>
            ))}

          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs">
              <span className="text-slate-500 block mb-1">جمع پرداختی ثبت‌شده</span>
              <strong className="text-blue-700 text-sm">{formatRials(paidAmount)}</strong>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs">
              <span className="text-slate-500 block mb-1">مانده بدهی قرارداد</span>
              <strong className="text-rose-600 text-sm">{formatRials(contractDebt)}</strong>
            </div>
            <button
              onClick={onQuickPayment}
              className="rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 px-4 py-3 text-right transition text-xs shadow-xs"
            >
              <span className="text-emerald-700 font-bold block mb-1">ثبت سریع پرداخت</span>
              <span className="text-slate-600">برای ثبت فوری واریزی جدید روی این مستطیل کلیک کنید</span>
            </button>
            <div className="rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-xs min-h-[96px]">
              <span className="text-violet-700 block mb-1 font-bold">گزارش و یادداشت سرویس</span>
              {hoveredMonth ? (
                <>
                  <div className="text-slate-800 font-semibold mb-1">{hoveredMonth.monthName} {hoveredMonth.year}</div>
                  <div className="text-slate-600 leading-6">{hoveredMonth.notes || 'برای این ماه هنوز گزارشی ثبت نشده است.'}</div>
                </>
              ) : (
                <div className="text-slate-500 leading-6">موس را روی هر مستطیل ماه ببرید تا گزارش همان سرویس را اینجا ببینید.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'breakdowns' && (
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-slate-800 text-sm">لیست گزارش‌های خرابی و قطعی</h4>
            <button 
              onClick={onReportDowntime}
              className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition"
            >
              ثبت خرابی جدید
            </button>
          </div>
          {breakdowns.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">هیچ خرابی ثبت نشده است.</p>
          ) : (
            <div className="space-y-2">
              {breakdowns.map((b) => (
                <div key={b.id} className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{b.description}</div>
                      <div className="text-slate-500 text-[11px] mt-0.5">تاریخ: {b.date} ساعت {b.time} | گزارش‌دهنده: {b.reportedBy} | سرویس‌کار: {b.technician}</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-700 font-medium text-[11px]">
                    برطرف شده
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'services' && (
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
          <h4 className="font-bold text-slate-800 mb-3">سرویس‌های دوره‌ای انجام شده و جاری</h4>
          <div className="space-y-2">
            {serviceMonths.map((m) => (
              <div key={m.id} className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between gap-4">
                <div className="flex-1">
                  <span className="font-bold text-slate-900">سرویس ماه {m.monthName} {m.year}</span>
                  <span className="text-slate-500 mr-2">({m.jalaliDate})</span>
                  <p className="text-slate-600 mt-1">{m.notes}</p>

                  {(m.usedParts?.length || 0) > 0 && (
                    <div className="mt-2 text-[11px] text-violet-700 bg-violet-50 border border-violet-200 rounded-lg px-2 py-1 inline-block">
                      {(m.usedParts?.length || 0)} قطعه ثبت شده
                    </div>
                  )}

                  {(m.extraServiceCost || 0) > 0 && (
                    <div className="mt-2 text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1 inline-block mr-2">
                      هزینه اضافه: {(m.extraServiceCost || 0).toLocaleString('fa-IR')} ریال
                    </div>
                  )}

                  {m.status === 'completed' && (
                    <div className="mt-3">
                      <button
                        onClick={() => onMonthPayment(m)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-[11px] font-semibold transition shadow-xs"
                      >
                        پرداخت این سرویس
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 self-start">
                  <span className={`px-2.5 py-1 rounded text-[11px] font-medium ${
                    m.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-700'
                      : m.status === 'in_progress'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-blue-100 text-blue-700'
                  }`}>
                    {getStatusLabel(m.status)}
                  </span>
                  <button 
                    onClick={() => onSelectMonth(m)}
                    className="p-1.5 hover:bg-slate-100 rounded text-slate-600 transition"
                  >
                    مشاهده
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'repair' && (
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
          <h4 className="font-bold text-slate-800 mb-2">سوابق سرویس و تعمیر قطعات</h4>
          <p className="text-slate-500 mb-3">گزارش تعویض قطعات (مانند سیم‌بکسل، لنت ترمز، شاسی احضار طبقات):</p>
          <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900">تعویض لنت ترمز موتور</span>
              <p className="text-slate-500 mt-1">توسط فنی‌کار ارشد - تاریخ: 1405/04/10</p>
            </div>
            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded text-[11px] font-medium">تکمیل شده</span>
          </div>
        </div>
      )}

      {activeTab === 'insurance' && (
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
          <h4 className="font-bold text-slate-800 mb-2">وضعیت بیمه مسئولیت مدنی آسانسور</h4>
          <div className="bg-white p-4 rounded-lg border border-slate-200 flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-900 text-sm">بیمه‌نامه شماره: بیمه ایران - 9845/1405</p>
              <p className="text-slate-500 mt-1">پوشش حوادث جانی و مالی مسافرین آسانسور تا سقف 5 میلیارد تومان</p>
              <p className="text-emerald-700 font-medium mt-2">اعتبار تا: 1406/05/01 (فعال و معتبر)</p>
            </div>
            <ShieldCheck className="w-12 h-12 text-emerald-600" />
          </div>
        </div>
      )}

      {activeTab === 'reminders' && (
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
          <h4 className="font-bold text-slate-800 mb-2">یادآوری‌های خودکار سیستم</h4>
          <div className="space-y-2">
            <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900">یادآوری سررسید سرویس ماهانه</span>
                <p className="text-slate-500 mt-0.5">ارسال پیامک به مدیر ساختمان 2 روز قبل از تاریخ سرویس</p>
              </div>
              <span className="text-emerald-600 font-bold">فعال</span>
            </div>
            <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900">یادآوری تمدید بیمه آسانسور</span>
                <p className="text-slate-500 mt-0.5">ارسال هشدار 30 روز قبل از اتمام بیمه‌نامه</p>
              </div>
              <span className="text-emerald-600 font-bold">فعال</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'downtime' && (
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
          <h4 className="font-bold text-slate-800 mb-2">تاریخچه توقف‌ها و قطعی آسانسور</h4>
          <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900">توقف به دلیل قطع برق منطقه‌ای</span>
              <p className="text-slate-500 mt-1">مدت توقف: 45 دقیقه - تاریخ: 1405/05/12</p>
            </div>
            <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-[11px]">ثبت سیستم</span>
          </div>
        </div>
      )}

    </div>
  );
};
