import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from '../services/employee.service';
import { Employee } from '../models/employee';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  employeeList: Employee[] = [];
  totalEmployee = 0;
  totalEmail = 0;

  constructor(
    private router: Router,
    private employeeService: EmployeeService,
  ) {}

  ngOnInit() {
    this.employeeService.getEmployee().subscribe((data) => {
      this.employeeList = data;
      this.totalEmployee = this.employeeList.length;
      this.totalEmail = this.employeeList.filter(
        (employee) => employee.email,
      ).length;
    });
  }

  logout() {
    localStorage.removeItem('isLoggedIn');
    this.router.navigate(['/login-page']);
  }
}
