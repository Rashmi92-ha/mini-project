export const NEW_INVOICE = {
  invoiceNumber: '',
  supplierName: '',
  invoiceDate: '',
  dueDate: '',
  amount: 0,
  tax: 0,
  currency: 'INR',
  status: 'Pending' as 'Pending' | 'Paid' | 'Overdue',
} as const;

export const OPEN_DIALOG = {
  invoiceNumber: '',
  supplierName: '',
  invoiceDate: '',
  dueDate: '',
  amount: 0,
  tax: 0,
  currency: 'INR',
  status: 'Pending',
} as const;