import { Contract, ServiceMonth, BreakdownRecord, PaymentRecord, DocumentItem, ChecklistItem, PartItem } from '../types';

export const initialContracts: Contract[] = [
  {
    id: '1',
    contractNumber: '5598',
    totalPayable: 7000000,
    paidAmount: 2000000,
    contractDebt: 5000000,
    buildingDebt: 0,
    customerBalance: 0,
    contractType: 'سرویس نگهداری - به ازای سرویس',
    coordinator: 'عادل ملک محمدی حکیم 19',
    buildingName: 'برج مسکونی آسمان',
    customerName: 'مهندس رضایی',
    address: 'تهران، خیابان ولیعصر، تقاطع توانیر',
    deviceCount: 2,
    startDate: '1405/05/01',
    endDate: '1406/05/01',
    status: 'active',
    nextServiceAmount: 7000000,
    elevatorSpecs: {
      stops: 8,
      capacity: '6 نفره (450 کیلوگرم)',
      type: 'موتور گیربکس ال‌وی‌اس',
      motorType: 'سیکور ایتالیا 5.5 کیلووات'
    }
  },
  {
    id: '2',
    contractNumber: '5612',
    totalPayable: 12500000,
    paidAmount: 12500000,
    contractDebt: 0,
    buildingDebt: 0,
    customerBalance: 1500000,
    contractType: 'سرویس نگهداری ماهیانه ثابت',
    coordinator: 'آقای مهدوی',
    buildingName: 'مجتمع تجاری نگین',
    customerName: 'شرکت ساختمانی سازه گستر',
    address: 'تهران، سعادت‌آباد، میدان کاج',
    deviceCount: 4,
    startDate: '1405/03/15',
    endDate: '1406/03/15',
    status: 'active',
    nextServiceAmount: 3125000,
    elevatorSpecs: {
      stops: 12,
      capacity: '10 نفره برانکاربر',
      type: 'گیرلس شیندلر',
      motorType: 'المانی اصل'
    }
  },
  {
    id: '3',
    contractNumber: '5480',
    totalPayable: 5400000,
    paidAmount: 5400000,
    contractDebt: 0,
    buildingDebt: 0,
    customerBalance: 0,
    contractType: 'سرویس نگهداری - دوره‌ای',
    coordinator: 'خانم اکبری',
    buildingName: 'ساختمان پزشکان پارس',
    customerName: 'دکتر علوی',
    address: 'تهران، خیابان شریعتی، بالاتر از میرداماد',
    deviceCount: 1,
    startDate: '1404/10/01',
    endDate: '1405/10/01',
    status: 'expired',
    nextServiceAmount: 5400000,
    elevatorSpecs: {
      stops: 5,
      capacity: '8 نفره',
      type: 'گیربکس بهادرسان',
      motorType: 'پرانرو ایتالیا'
    }
  }
];

export const initialServiceMonths: ServiceMonth[] = [
  { id: 'm1', monthName: 'مرداد', year: 1405, jalaliDate: '1405/05/20', status: 'completed', technician: 'محمد ناصری', notes: 'سرویس دوره‌ای کامل انجام شد. روغن‌کاری و رگلاژ درب‌ها انجام گرفت.', checklistPassed: true },
  { id: 'm2', monthName: 'شهریور', year: 1405, jalaliDate: '1405/06/20', status: 'scheduled', technician: 'علی حیدری', notes: 'برنامه‌ریزی شده' },
  { id: 'm3', monthName: 'مهر', year: 1405, jalaliDate: '1405/07/20', status: 'scheduled', technician: 'علی حیدری', notes: 'برنامه‌ریزی شده' },
  { id: 'm4', monthName: 'آبان', year: 1405, jalaliDate: '1405/08/20', status: 'scheduled', technician: 'محمد ناصری', notes: 'برنامه‌ریزی شده' },
  { id: 'm5', monthName: 'آذر', year: 1405, jalaliDate: '1405/09/20', status: 'scheduled', technician: 'حسین رضایی', notes: 'برنامه‌ریزی شده' },
  { id: 'm6', monthName: 'دی', year: 1405, jalaliDate: '1405/10/20', status: 'scheduled', technician: 'حسین رضایی', notes: 'برنامه‌ریزی شده' },
  { id: 'm7', monthName: 'بهمن', year: 1405, jalaliDate: '1405/11/20', status: 'scheduled', technician: 'محمد ناصری', notes: 'برنامه‌ریزی شده' },
  { id: 'm8', monthName: 'اسفند', year: 1405, jalaliDate: '1405/12/20', status: 'scheduled', technician: 'علی حیدری', notes: 'برنامه‌ریزی شده' },
  { id: 'm9', monthName: 'فروردین', year: 1406, jalaliDate: '1406/01/20', status: 'scheduled', technician: 'محمد ناصری', notes: 'برنامه‌ریزی شده' },
  { id: 'm10', monthName: 'اردیبهشت', year: 1406, jalaliDate: '1406/02/20', status: 'scheduled', technician: 'حسین رضایی', notes: 'برنامه‌ریزی شده' },
];

export const initialBreakdowns: BreakdownRecord[] = [
  { id: 'b1', date: '1405/05/12', time: '14:30', reportedBy: 'سرایدار ساختمان', description: 'گیر کردن آسانسور بین طبقه 3 و 4 به علت قطع برق ناگهانی و خرابی نجات اضطراری', status: 'resolved', technician: 'محمد ناصری' },
  { id: 'b2', date: '1405/04/05', time: '09:15', reportedBy: 'واحد 12', description: 'سر و صدای غیرمتعارف در فلکه اصلی موتور هنگام حرکت رو به بالا', status: 'resolved', technician: 'علی حیدری' }
];

export const initialPayments: PaymentRecord[] = [
  { id: 'p1', date: '1405/05/02', amount: 2000000, receiptNumber: 'REC-8841', method: 'کارتخوان / پوز بانکی', description: 'قسط اول قرارداد سرویس سالانه' }
];

export const initialDocuments: DocumentItem[] = [
  { id: 'd1', title: 'قرارداد اصلی سرویس و نگهداری 1405-1406', type: 'PDF', uploadDate: '1405/05/01', fileSize: '2.4 مگابایت' },
  { id: 'd2', title: 'بیمه‌نامه مسئولیت مدنی آسانسور', type: 'PDF', uploadDate: '1405/05/02', fileSize: '1.8 مگابایت' },
  { id: 'd3', title: 'گواهی بازرسی ادواری استاندارد', type: 'Image/JPG', uploadDate: '1405/05/05', fileSize: '950 کیلوبایت' }
];

export const initialChecklist: ChecklistItem[] = [
  { id: 'c1', category: 'موتورخانه', item: 'بررسی سطح روغن گیربکس و عدم نشت', status: 'checked', description: 'سطح روغن نرمال بود' },
  { id: 'c2', category: 'موتورخانه', item: 'تست ترمز مکانیکی و بوبین', status: 'checked', description: 'عملکرد صحیح' },
  { id: 'c3', category: 'چاه آسانسور', item: 'بازرسی سیم بکسل‌ها از نظر سائیدگی و گسیختگی', status: 'checked', description: 'بدون اشکال' },
  { id: 'c4', category: 'چاه آسانسور', item: 'کنترل عملکرد میکروسوئیچ‌های حدی بالا و پایین', status: 'checked', description: 'تست شد و سالم است' },
  { id: 'c5', category: 'کابین و درب‌ها', item: 'رگلاژ درب‌های طبقات و کابین (اتوماتیک)', status: 'checked', description: 'روغن‌کاری و تنظیم شد' },
  { id: 'c6', category: 'کابین و درب‌ها', item: 'تست سیستم آلارم اضطراری و روشنایی کابین', status: 'checked', description: 'سالم' },
  { id: 'c7', category: 'سیستم ایمنی', item: 'تست گاورنر و پاراشوت', status: 'warning', description: 'نیاز به تست سالیانه بار در ماه آینده دارد' }
];

export const initialParts: PartItem[] = [
  { id: 'part-1', name: 'روغن گیربکس', unit: 'عدد', price: 450000, stock: 14, category: 'مصرفی' },
  { id: 'part-2', name: 'لنت ترمز', unit: 'دست', price: 1800000, stock: 6, category: 'ایمنی' },
  { id: 'part-3', name: 'شاسی احضار طبقه', unit: 'عدد', price: 950000, stock: 12, category: 'برقی' },
  { id: 'part-4', name: 'لامپ روشنایی کابین', unit: 'عدد', price: 120000, stock: 30, category: 'برقی' },
];
