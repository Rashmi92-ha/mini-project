export interface Employee {
  _id?: string;
  name: string;
  email: string;
  department: string;
  role: string;
  salary: number;
  status?: 'Active' | 'Inactive';
}
