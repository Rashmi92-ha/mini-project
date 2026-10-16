export const STATUS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
} as const;

export const STATUS_OPTIONS = [
  {
    name: STATUS.ACTIVE,
    value: STATUS.ACTIVE,
  },
  {
    name: STATUS.INACTIVE,
    value: STATUS.INACTIVE,
  },
];

export const INVOICE_STATUS = {
  PENDING: 'Pending',
  PAID: 'Paid',
  OVERDUE: 'Overdue',
} as const;

export const INVOICE_STATUS_OPTIONS = [
  { label: 'All', value: 'All' },
  { label: 'Pending', value: INVOICE_STATUS.PENDING },
  { label: 'Paid', value: INVOICE_STATUS.PAID },
  { label: 'Overdue', value: INVOICE_STATUS.OVERDUE },
] as const;
