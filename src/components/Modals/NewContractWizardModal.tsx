import React, { useMemo, useState } from 'react';
import { X, ChevronLeft, ChevronRight, CheckCircle2, Plus, Search } from 'lucide-react';
import { Contract } from '../../types';

interface NewContractWizardModalProps {
  contracts: Contract[];
  onClose: () => void;
  onCreateContract: (contract: Contract) => void;
}

type StepKey = 'customer' | 'building' | 'contract' | 'device' | 'financial' | 'overview';

const stepLabels: { key: StepKey; label: string }[] = [
  { key: 'customer', label: 'اطلاعات مشتری' },
  { key: 'building', label: 'اطلاعات ساختمان' },
  { key: 'contract', label: 'اطلاعات قرارداد' },
  { key: 'device', label: 'اطلاعات دستگاه' },
  { key: 'financial', label: 'اطلاعات مالی' },
  { key: 'overview', label: 'نمای کلی' },
];

const serviceStaff = ['بهمن کشاورز', 'مجتبی فرهمند', 'محسن امامی بربری'];
const monthsFa = ['مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند', 'فروردین', 'اردیبهشت'];

export const NewContractWizardModal: React.FC<NewContractWizardModalProps> = ({ contracts, onClose, onCreateContract }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [searchCustomer, setSearchCustomer] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>(['بهمن کشاورز', 'مجتبی فرهمند', 'محسن امامی بربری']);
  const [customers, setCustomers] = useState<Array<{ id: string; name: string; phone: string; buildings: number }>>([]);
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '' });

  const [form, setForm] = useState({
    customerName: '',
    coordinator: '',
    customerPhone: '',
    buildingName: 'رحمانی کوچه شهامت',
    secondName: '',
    subscriptionNumber: String(contracts.length + 142),
    licenseNumber: '',
    floors: '4',
    buildYear: '1398',
    province: 'تهران',
    city: 'تهران',
    region: 'حکیم',
    usage: 'مسکونی',
    postalCode: '',
    address: 'بلوار حکیم فرزانگان، سرآج جنوبی، کوچه حکیم، پلاک 7',
    contractNumber: String(Math.max(...contracts.map((c) => Number(c.contractNumber))) + 1),
    contractDate: '1405/05/23',
    startDate: '1405/05/23',
    endDate: '1406/02/26',
    paymentMethod: 'به ازای سرویس',
    description: '',
    deviceCount: '1',
    stops: '4',
    capacity: '6 نفره',
    elevatorType: 'کششی گیربکس',
    motorType: 'موتوژن / سیکور',
    repeatBase: 'ماه',
    period: '1',
    dayOfMonth: '26',
    serviceAmount: '700000',
    serviceCount: '10',
    discount: '0',
    previousDebt: '0',
    tax: '0',
  });

  const currentStep = stepLabels[stepIndex].key;

  const filteredCustomers = useMemo(
    () => customers.filter((c) => c.name.includes(searchCustomer) || c.phone.includes(searchCustomer)),
    [customers, searchCustomer]
  );

  const handleAddCustomer = () => {
    if (!newCustomer.name.trim() || !newCustomer.phone.trim()) return;

    const createdCustomer = {
      id: `cust-${Date.now()}`,
      name: newCustomer.name.trim(),
      phone: newCustomer.phone.trim(),
      buildings: 0,
    };

    setCustomers((prev) => [createdCustomer, ...prev]);
    setSelectedCustomerId(createdCustomer.id);
    setForm((prev) => ({
      ...prev,
      customerName: createdCustomer.name,
      coordinator: createdCustomer.name,
      customerPhone: createdCustomer.phone,
    }));
    setNewCustomer({ name: '', phone: '' });
    setShowNewCustomerForm(false);
  };

  const totalServicesAmount = Number(form.serviceAmount || 0) * Number(form.serviceCount || 0);
  const finalAmount = totalServicesAmount + Number(form.tax || 0) - Number(form.discount || 0) + Number(form.previousDebt || 0);

  const toggleServiceStaff = (name: string) => {
    setSelectedServices((prev) => (prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]));
  };

  const goNext = () => setStepIndex((prev) => Math.min(prev + 1, stepLabels.length - 1));
  const goPrev = () => setStepIndex((prev) => Math.max(prev - 1, 0));

  const submitContract = () => {
    const totalPayable = finalAmount;
    const serviceAmount = Number(form.serviceAmount || 0);

    const newContract: Contract = {
      id: `contract-${Date.now()}`,
      contractNumber: form.contractNumber,
      totalPayable,
      paidAmount: 0,
      contractDebt: Number(form.previousDebt || 0),
      buildingDebt: Number(form.previousDebt || 0),
      customerBalance: 0,
      contractType: `سرویس نگهداری - ${form.paymentMethod}`,
      coordinator: form.coordinator,
      buildingName: form.buildingName,
      customerName: form.customerName,
      address: form.address,
      deviceCount: Number(form.deviceCount || 1),
      startDate: form.startDate,
      endDate: form.endDate,
      status: 'active',
      nextServiceAmount: serviceAmount,
      elevatorSpecs: {
        stops: Number(form.stops || 0),
        capacity: form.capacity,
        type: form.elevatorType,
        motorType: form.motorType,
      },
    };

    onCreateContract(newContract);
  };

  const renderStep = () => {
    if (currentStep === 'customer') {
      return (
        <div className="space-y-4">
          <div className="bg-violet-100 text-violet-800 rounded-xl px-4 py-2 text-sm font-semibold text-center">لیست مشتری‌ها خالی است؛ می‌توانید مشتری جدید اضافه کنید</div>
          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-4">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={searchCustomer} onChange={(e) => setSearchCustomer(e.target.value)} placeholder="جستجو در مشتری‌های ثبت شده" className="w-full pr-9 pl-3 py-2 rounded-xl border border-slate-300" />
              </div>
              <button onClick={() => setShowNewCustomerForm((prev) => !prev)} className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl text-sm font-semibold">مشتری جدید</button>
            </div>

            {showNewCustomerForm && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <input value={newCustomer.name} onChange={(e) => setNewCustomer((prev) => ({ ...prev, name: e.target.value }))} placeholder="نام مشتری" className="rounded-xl border border-slate-300 px-3 py-2" />
                <input value={newCustomer.phone} onChange={(e) => setNewCustomer((prev) => ({ ...prev, phone: e.target.value }))} placeholder="شماره تماس" className="rounded-xl border border-slate-300 px-3 py-2" />
                <button onClick={handleAddCustomer} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-4 py-2 font-semibold">ذخیره مشتری</button>
              </div>
            )}

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="grid grid-cols-4 bg-slate-50 text-xs font-bold text-slate-600 px-4 py-3">
                <div>نام مشتری</div><div>تعداد ساختمان‌ها</div><div>شماره تماس</div><div>فعال</div>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {filteredCustomers.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-slate-500">هنوز مشتری‌ای ثبت نشده است. از دکمه «مشتری جدید» استفاده کنید.</div>
                ) : (
                  filteredCustomers.map((customer, idx) => (
                    <button
                      key={customer.id}
                      onClick={() => {
                        setSelectedCustomerId(customer.id);
                        setForm((prev) => ({ ...prev, customerName: customer.name, coordinator: customer.name, customerPhone: customer.phone }));
                      }}
                      className={`w-full grid grid-cols-4 text-sm px-4 py-3 border-t border-slate-100 text-right hover:bg-amber-50 transition ${selectedCustomerId === customer.id ? 'bg-amber-50' : 'bg-white'}`}
                    >
                      <div>{idx + 1}. {customer.name}</div>
                      <div>{customer.buildings}</div>
                      <div>{customer.phone}</div>
                      <div className="text-emerald-600 font-bold">✓</div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (currentStep === 'building') {
      return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <input value={form.subscriptionNumber} onChange={(e) => setForm({ ...form, subscriptionNumber: e.target.value })} placeholder="شماره اشتراک" className="rounded-xl border border-slate-300 px-3 py-2" />
          <div className="flex gap-2">
            <input value={form.buildingName} onChange={(e) => setForm({ ...form, buildingName: e.target.value })} placeholder="نام ساختمان" className="flex-1 rounded-xl border border-slate-300 px-3 py-2" />
            <button className="w-10 rounded-xl border border-slate-300 text-slate-600">+</button>
          </div>
          <input value={form.secondName} onChange={(e) => setForm({ ...form, secondName: e.target.value })} placeholder="نام دوم" className="rounded-xl border border-slate-300 px-3 py-2" />
          <input value={form.licenseNumber} onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })} placeholder="پروانه ساختمان" className="rounded-xl border border-slate-300 px-3 py-2" />
          <input value={form.buildYear} onChange={(e) => setForm({ ...form, buildYear: e.target.value })} placeholder="سال ساخت" className="rounded-xl border border-slate-300 px-3 py-2" />
          <input value={form.floors} onChange={(e) => setForm({ ...form, floors: e.target.value })} placeholder="تعداد طبقات" className="rounded-xl border border-slate-300 px-3 py-2" />
          <input value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value })} placeholder="استان" className="rounded-xl border border-slate-300 px-3 py-2" />
          <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="شهر" className="rounded-xl border border-slate-300 px-3 py-2" />
          <input value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} placeholder="منطقه" className="rounded-xl border border-slate-300 px-3 py-2" />
          <input value={form.usage} onChange={(e) => setForm({ ...form, usage: e.target.value })} placeholder="کاربری" className="rounded-xl border border-slate-300 px-3 py-2" />
          <input value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} placeholder="کدپستی" className="rounded-xl border border-slate-300 px-3 py-2 md:col-span-2" />
          <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="آدرس ساختمان" className="rounded-xl border border-slate-300 px-3 py-2 md:col-span-3" />
        </div>
      );
    }

    if (currentStep === 'contract') {
      return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <input value={form.contractNumber} onChange={(e) => setForm({ ...form, contractNumber: e.target.value })} placeholder="شماره قرارداد" className="rounded-xl border border-slate-300 px-3 py-2" />
          <input value={form.contractDate} onChange={(e) => setForm({ ...form, contractDate: e.target.value })} placeholder="تاریخ عقد قرارداد" className="rounded-xl border border-slate-300 px-3 py-2" />
          <input value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} placeholder="تاریخ شروع" className="rounded-xl border border-slate-300 px-3 py-2" />
          <input value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} placeholder="تاریخ پایان" className="rounded-xl border border-slate-300 px-3 py-2" />
          <select value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })} className="rounded-xl border border-slate-300 px-3 py-2 md:col-span-2">
            <option>به ازای سرویس</option>
            <option>ماهیانه ثابت</option>
            <option>دوره‌ای</option>
          </select>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="توضیحات" className="rounded-xl border border-slate-300 px-3 py-2 min-h-40 md:col-span-2" />
        </div>
      );
    }

    if (currentStep === 'device') {
      return (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl text-sm font-semibold">ثبت دستگاه جدید</button>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <input value={form.deviceCount} onChange={(e) => setForm({ ...form, deviceCount: e.target.value })} placeholder="تعداد دستگاه" className="rounded-xl border border-slate-300 px-3 py-2" />
            <input value={form.stops} onChange={(e) => setForm({ ...form, stops: e.target.value })} placeholder="تعداد توقف" className="rounded-xl border border-slate-300 px-3 py-2" />
            <input value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} placeholder="ظرفیت" className="rounded-xl border border-slate-300 px-3 py-2" />
            <input value={form.elevatorType} onChange={(e) => setForm({ ...form, elevatorType: e.target.value })} placeholder="نوع دستگاه" className="rounded-xl border border-slate-300 px-3 py-2" />
            <input value={form.motorType} onChange={(e) => setForm({ ...form, motorType: e.target.value })} placeholder="نوع موتور" className="rounded-xl border border-slate-300 px-3 py-2 md:col-span-2" />
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col lg:flex-row gap-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 flex-1">
              {monthsFa.map((month) => (
                <div key={month} className="rounded-xl border border-slate-200 p-3 text-center text-sm bg-slate-50">
                  <div className="font-bold text-slate-800">{month}</div>
                  <div className="text-xs text-slate-500 mt-2">روز {form.dayOfMonth}</div>
                </div>
              ))}
            </div>
            <div className="w-full lg:w-80 rounded-2xl border border-slate-200 p-4 bg-slate-50 space-y-3 text-sm">
              <div className="flex gap-4">
                <label className="flex items-center gap-2"><input type="radio" defaultChecked /> تکرار سرویس</label>
                <label className="flex items-center gap-2"><input type="radio" /> سرویس تکی</label>
              </div>
              <select value={form.repeatBase} onChange={(e) => setForm({ ...form, repeatBase: e.target.value })} className="w-full rounded-xl border border-slate-300 px-3 py-2">
                <option>ماه</option>
                <option>هفته</option>
              </select>
              <div className="grid grid-cols-2 gap-3">
                <input value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} placeholder="دوره" className="rounded-xl border border-slate-300 px-3 py-2" />
                <input value={form.dayOfMonth} onChange={(e) => setForm({ ...form, dayOfMonth: e.target.value })} placeholder="هر چندم" className="rounded-xl border border-slate-300 px-3 py-2" />
              </div>
              <div>
                <div className="text-slate-700 mb-2">سرویسکارها</div>
                <div className="space-y-2">
                  {serviceStaff.map((person) => (
                    <label key={person} className="flex items-center justify-between bg-white rounded-xl border border-slate-200 px-3 py-2">
                      <span>{person}</span>
                      <input type="checkbox" checked={selectedServices.includes(person)} onChange={() => toggleServiceStaff(person)} />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (currentStep === 'financial') {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-sm">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
            {[
              ['مبلغ کل سرویس ها', totalServicesAmount],
              ['مالیات', Number(form.tax || 0)],
              ['تخفیف', Number(form.discount || 0)],
              ['بدهی قبلی', Number(form.previousDebt || 0)],
              ['مبلغ نهایی قرارداد', finalAmount],
            ].map(([label, value]) => (
              <div key={String(label)} className={`flex items-center justify-between rounded-xl px-4 py-3 ${label === 'مبلغ نهایی قرارداد' ? 'bg-violet-700 text-white font-bold' : 'bg-slate-100 text-slate-700'}`}>
                <span>{String(label)}</span>
                <span>{Number(value).toLocaleString('fa-IR')} ریال</span>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
            <div className="rounded-xl bg-slate-100 px-3 py-2 inline-block text-sm">{form.serviceCount} سرویس</div>
            <input value={form.serviceAmount} onChange={(e) => setForm({ ...form, serviceAmount: e.target.value })} placeholder="مبلغ هر سرویس" className="w-full rounded-xl border border-slate-300 px-3 py-2" />
            <input value={form.serviceCount} onChange={(e) => setForm({ ...form, serviceCount: e.target.value })} placeholder="تعداد سرویس" className="w-full rounded-xl border border-slate-300 px-3 py-2" />
            <input value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} placeholder="تخفیف" className="w-full rounded-xl border border-slate-300 px-3 py-2" />
            <input value={form.tax} onChange={(e) => setForm({ ...form, tax: e.target.value })} placeholder="مالیات" className="w-full rounded-xl border border-slate-300 px-3 py-2" />
            <input value={form.previousDebt} onChange={(e) => setForm({ ...form, previousDebt: e.target.value })} placeholder="بدهی قبلی" className="w-full rounded-xl border border-slate-300 px-3 py-2" />
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 text-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4"><strong>مشتری:</strong> {form.customerName}</div>
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4"><strong>ساختمان:</strong> {form.buildingName}</div>
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4"><strong>شماره قرارداد:</strong> {form.contractNumber}</div>
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4"><strong>بازه:</strong> {form.startDate} تا {form.endDate}</div>
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4"><strong>دستگاه:</strong> {form.deviceCount} دستگاه / {form.stops} توقف</div>
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4"><strong>مبلغ نهایی:</strong> {finalAmount.toLocaleString('fa-IR')} ریال</div>
        </div>
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          <span>همه اطلاعات تکمیل شده است. برای ثبت نهایی قرارداد روی دکمه زیر بزنید.</span>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-slate-100 rounded-3xl shadow-2xl w-full max-w-7xl border border-slate-200 overflow-hidden max-h-[94vh] flex flex-col">
        <div className="bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-violet-100 text-violet-700 px-3 py-1 rounded-xl font-bold text-sm">قرارداد جدید</div>
            <span className="text-slate-500 text-sm">سرویس و نگهداری</span>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-4 border-b border-slate-200 bg-white overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            {stepLabels.map((step, index) => {
              const isActive = index === stepIndex;
              const isDone = index < stepIndex;
              return (
                <button
                  key={step.key}
                  onClick={() => setStepIndex(index)}
                  className={`px-5 py-3 rounded-2xl text-sm font-semibold transition border ${isActive ? 'bg-amber-500 text-white border-amber-500' : isDone ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}
                >
                  {step.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1">{renderStep()}</div>

        <div className="bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-between">
          <button onClick={goPrev} disabled={stepIndex === 0} className="px-5 py-2 rounded-xl border border-slate-300 text-slate-700 disabled:opacity-40 flex items-center gap-1.5">
            <ChevronRight className="w-4 h-4" />
            قبلی
          </button>
          <div className="flex items-center gap-2">
            {stepIndex < stepLabels.length - 1 ? (
              <button onClick={goNext} className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold flex items-center gap-1.5">
                بعدی
                <ChevronLeft className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={submitContract} className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5">
                <Plus className="w-4 h-4" />
                ثبت نهایی قرارداد
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
