export const USER_ROLES = {
  ADMIN: 'Admin',
  USER: 'User',
} as const;

export const USER_ROLE_OPTIONS = [
  {
    name: USER_ROLES.ADMIN,
    value: USER_ROLES.ADMIN,
  },
  {
    name: USER_ROLES.USER,
    value: USER_ROLES.USER,
  },
];
