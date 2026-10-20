export const SUCCESS_MESSAGES = {
  USER_CREATED: 'User added successfully',
  USER_UPDATED: 'User updated successfully',
  USER_DELETED: 'User deleted successfully',

  EMPLOYEE_CREATED: 'Employee added successfully',
  EMPLOYEE_UPDATED: 'Employee updated successfully',
  EMPLOYEE_DELETED: 'Employee deleted successfully',

  INVOICE_CREATED: 'Invoice created successfully!',
  INVOICE_UPDATED: 'Invoice updated successfully',

  DEPARMENT_CREATED: 'Department created successfully.',
  DEPARTMENT_UPADATE: 'Department updated successfully.',
   DEPARTMENT_DELETE: 'Department deleted successfully.',
} as const;

export const ERROR_MESSAGES = {
  USER_CREATE: 'Failed to add user',
  USER_UPDATE: 'Failed to update user',
  USER_DELETE: 'Failed to delete user',

  EMPLOYEE_CREATE: 'Failed to add employee',
  EMPLOYEE_UPDATE: 'Failed to update employee',
  EMPLOYEE_DELETE: 'Failed to delete employee',
  EMPLOYEE_LOAD: 'Unable to load employees',

  INVOICE_CREATION_FAILD: 'Failed to create invoice.',
  INVOICE_LOADING_FAILD: 'Failed to load invoices',
  INVALID_ID: 'Invalid invoice ID.',
  INVALID_DELETION: 'Unable to delete invoice',

  LOAD_DEPARTMENTS: 'Failed to load departments.',
  DEPARTMENT_CREATE: 'Failed to create department.',
  DEPARTMENT_UPDATE: 'Failed to update department.',
  DEPARTMENT_DELETE: 'Failed to delete department.',
} as const;

export const REQUIRED_MESSAGES = { 
  REQUIRED_FIELDS: 'Please fill in all required fields with valid values.',
} as const;