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