export interface Invoice {
  _id?: string;
  invoiceNumber: string;
  supplierName: string;
  invoiceDate: string;
  dueDate?: string | null;
  amount: number;
  tax: number;
  currency: string;
  status: 'Pending' | 'Paid' | 'Overdue';
  tenantId?: string;
  createdAt?: string;
  updatedAt?: string;
}