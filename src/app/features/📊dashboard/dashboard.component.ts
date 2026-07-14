import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from '../../core/⚙️services/employee.service';
import { Employee } from '../👨‍💼employee/📦models/employee';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/⚙️services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  employeeList: Employee[] = [];
  totalEmployee = 0;
  totalEmail = 0;
  totalDepartment = 0;
  totalActive = 0;
  searchText = '';
  isAscending = true;

  constructor(
    private router: Router,
    private employeeService: EmployeeService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.employeeService.getEmployee().subscribe((data) => {
      this.employeeList = data;
      this.totalEmployee = this.employeeList.length;
      this.totalEmail = this.employeeList.filter(
        (employee) => employee.email,
      ).length;
      this.totalDepartment = this.employeeList.filter(
        (employee) => employee.department,
      ).length;
      this.totalActive = this.employeeList.filter(
        (employee) => employee.status === 'Active',
      ).length;
    });
  }

  get filteredEmployees() {
    return this.employeeList.filter((employee) =>
      employee.name.toLowerCase().includes(this.searchText.toLowerCase()),
    );
  }

  sortEmployee() {
    if (this.isAscending) {
      this.employeeList.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      this.employeeList.sort((a, b) => b.name.localeCompare(a.name));
    }
    this.isAscending = !this.isAscending;
  }

  removeEmployee(id: string) {
    // ✅ changed from number to string
    this.employeeService.deleteEmployee(id).subscribe({
      // ✅ now calls real API, was just filtering array
      next: () => {
        this.employeeList = this.employeeList.filter(
          (employee) => employee._id !== id,
        );
      },
      error: (err) => console.error('Delete failed', err),
    });
  }
}
