import { STATUS } from '../../shared/constants/status.constants';

export type EmployeeStatus =
  (typeof STATUS)[keyof typeof STATUS];

export interface Employee {
  _id?: string;
  name: string;
  email: string;
  department: string;
  role: string;
  salary: number;
  status: EmployeeStatus;
}