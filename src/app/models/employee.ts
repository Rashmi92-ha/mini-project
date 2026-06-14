export interface Employee {
  id?: number;
  name: string;
  email: string;
  phone: string;
  company?: {
    name: string;
  };
  designation: string;
  salary: number | string;
}