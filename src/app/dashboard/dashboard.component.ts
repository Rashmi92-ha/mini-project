import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from '../services/employee.service';
import { Employee } from '../models/employee';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EmployeeCardComponent } from '../employee-card/employee-card.component';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, EmployeeCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  employeeList: Employee[] = [];
  totalEmployee = 0;
  totalEmail = 0;
  totalPhone = 0;
  totalCompany = 0;
  searchText = '';
  isAscending = true;

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
      this.totalPhone = this.employeeList.filter(
        (employeePhone) => employeePhone.phone,
      ).length;
      this.totalCompany = this.employeeList.filter(
        (employeeCompany) => employeeCompany.company?.name,
      ).length;
    });
  }

  get filteredEmployees() {
    return this.employeeList.filter((employee) =>
      employee.name.toLowerCase().includes(this.searchText.toLowerCase()),
    );
  }

  logout() {
    localStorage.removeItem('isLoggedIn');
    this.router.navigate(['/login-page']);
  }

  sortEmployee() {
    if (this.isAscending) {
      this.employeeList.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      this.employeeList.sort((a, b) => b.name.localeCompare(a.name));
    }
    this.isAscending = !this.isAscending;
  }

  removeEmployee(id: number) {
    this.employeeList = this.employeeList.filter(
      (employee) => employee.id !== id,
    );
  }
}
