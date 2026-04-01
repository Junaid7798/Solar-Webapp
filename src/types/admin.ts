export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  unit: string;
  minStock: number;
  price: number;
}

export interface Quotation {
  id: string;
  customer: string;
  city: string;
  size: string;
  date: string;
  status: 'Sent' | 'Accepted' | 'Rejected' | 'Revised';
  total: string;
}

export interface Project {
  id: string;
  customer: string;
  city: string;
  size: string;
  status: string;
  progress: number;
  value: number;
  expenses: number;
  startDate: string;
  deadline?: string;
}

export interface AMCContract {
  id: string;
  customer: string;
  city: string;
  size: string;
  phone: string;
  lastService: string;
  nextService: string;
  status: 'Active' | 'Due Soon' | 'Overdue' | 'Expired';
}

export interface Reminder {
  id: number;
  type: string;
  customer: string;
  date: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'Completed';
}

export interface GalleryImage {
  id: number;
  url: string;
  category: string;
  title: string;
}

export interface FinanceMonth {
  month?: string;
  name?: string;
  revenue: number;
  expenses: number;
}

export interface FinanceCategory {
  name: string;
  value: number;
  color: string;
}

export type ColorKey = 'blue' | 'red' | 'emerald' | 'sun' | 'amber';
