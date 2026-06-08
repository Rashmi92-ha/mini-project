import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor(private httpClient: HttpClient) {}

  getEmployee(): Observable<Employee[]> {
    return this.httpClient.get<Employee[]>(
      'https://jsonplaceholder.typicode.com/users',
    );
  }

  addEmployee(employee: Employee): Observable<Employee> {
    return this.httpClient.post<Employee>(
      'https://jsonplaceholder.typicode.com/users',
      employee,
    );
  }

  getEmployeeById(id: string): Observable<Employee> {
    return this.httpClient.get<Employee>(
      `https://jsonplaceholder.typicode.com/users/${id}`,
    );
  }
}
