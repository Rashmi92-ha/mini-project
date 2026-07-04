import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../📦models/employee';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiUrl = `${environment.apiUrl}/employees`;
  constructor(private httpClient: HttpClient) {}

  getEmployee(): Observable<Employee[]> {
    return this.httpClient.get<Employee[]>(`${this.apiUrl}`);
  }

  addEmployee(employee: Employee): Observable<Employee> {
    return this.httpClient.post<Employee>(`${this.apiUrl}`, employee);
  }

  getEmployeeById(id: string): Observable<Employee> {
    return this.httpClient.get<Employee>(`${this.apiUrl}/${id}`);
  }

  updateEmployee(employee: Employee): Observable<Employee> {
    return this.httpClient.put<Employee>(
      `${this.apiUrl}/${employee._id}`,
      employee,
    );
  }

  deleteEmployee(id: string): Observable<any> {
    return this.httpClient.delete(`${this.apiUrl}/${id}`);
  }
}
