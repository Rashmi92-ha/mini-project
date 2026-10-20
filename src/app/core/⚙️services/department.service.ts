import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENPOINTS } from '../../shared/constants/api.constants';
import {
  Department,
  DepartmentPayload,
} from '../../features/department/models/department.model';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private http = inject(HttpClient);
  private apiUrl = API_ENPOINTS.AUTH.DEPARTMENTS;

  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(this.apiUrl);
  }

  getDepartmentById(id: string): Observable<Department> {
    return this.http.get<Department>(`${this.apiUrl}/${id}`);
  }

  createDepartment(payload: DepartmentPayload): Observable<Department> {
    return this.http.post<Department>(this.apiUrl, payload);
  }

  updateDepartment(
    id: string,
    payload: Partial<DepartmentPayload>,
  ): Observable<Department> {
    return this.http.put<Department>(`${this.apiUrl}/${id}`, payload);
  }

  deleteDepartment(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
