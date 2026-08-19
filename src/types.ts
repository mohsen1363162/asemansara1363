export interface Contract {
  id: string;
  contractNumber: string;
  totalPayable: number;
  paidAmount: number;
  contractDebt: number;
  buildingDebt: number;
  customerBalance: number;
  contractType: string;
  coordinator: string;
  buildingName: string;
  customerName: string;
  address: string;
  deviceCount: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'terminated' | 'expired' | 'renewed';
  nextServiceAmount: number;
  elevatorSpecs: {
    stops: number;
    capacity: string;
    type: string;
    motorType: string;
  };
}

export interface PartItem {
  id: string;
  name: string;
  unit: string;
  price: number;
  stock: number;
  category?: string;
}

export interface MonthUsageItem {
  id: string;
  partId: string;
  partName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  description?: string;
  includeInInvoice: boolean;
}

export interface ServiceMonth {
  id: string;
  monthName: string;
  year: number;
  jalaliDate: string;
  status: 'completed' | 'scheduled' | 'pending' | 'in_progress' | 'cancelled';
  dateStr?: string;
  technician?: string;
  notes?: string;
  checklistPassed?: boolean;
  usedParts?: MonthUsageItem[];
  extraServiceCost?: number;
}

export interface BreakdownRecord {
  id: string;
  date: string;
  time: string;
  reportedBy: string;
  description: string;
  status: 'resolved' | 'pending' | 'in_progress';
  technician: string;
}

export interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  receiptNumber: string;
  method: string;
  description: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  type: string;
  uploadDate: string;
  fileSize: string;
}

export interface ChecklistItem {
  id: string;
  category: string;
  item: string;
  status: 'checked' | 'warning' | 'failed' | 'unchecked';
  description?: string;
}
