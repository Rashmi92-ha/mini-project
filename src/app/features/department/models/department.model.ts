export interface Department {
  _id: string;
  name: string;
  description: string;
  tenantId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DepartmentPayload {
  name: string;
  description?: string;
}
