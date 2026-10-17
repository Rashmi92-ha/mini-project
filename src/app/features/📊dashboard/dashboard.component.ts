import { Component, inject, OnInit } from '@angular/core';
import { EmployeeService } from '../../core/⚙️services/employee.service';
import { Employee } from '../👨‍💼employee/📦models/employee';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import {
  InvoiceService,
  InvoiceSummary,
} from '../../core/⚙️services/invoice.service';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    InputIconModule,
    TagModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  employeeList: Employee[] = [];
  departmentSummary: { name: string; count: number }[] = [];
  totalEmployee = 0;
  totalEmail = 0;
  totalDepartment = 0;
  totalActive = 0;
  totalInvoices = 0;
  paidInvoices = 0;
  pendingInvoices = 0;
  overdueInvoices = 0;

  private employeeService = inject(EmployeeService);
  private invoiceService = inject(InvoiceService);

  ngOnInit() {
    this.employeeService.getEmployee().subscribe((data) => {
      this.employeeList = data;
      this.totalEmployee = this.employeeList.length;
      this.totalEmail = this.employeeList.filter(
        (employee) => employee.email,
      ).length;
      this.totalDepartment = new Set(
        this.employeeList
          .map((employee) => employee.department?.trim())
          .filter((department) => department),
      ).size;
      this.totalActive = this.employeeList.filter(
        (employee) => employee.status === 'Active',
      ).length;
    });
    this.loadInvoiceSummary();
  }

  loadInvoiceSummary(): void {
    this.invoiceService.getInvoiceSummary().subscribe({
      next: (summary: InvoiceSummary) => {
        this.totalInvoices = summary.totalInvoices;
        this.paidInvoices = summary.paidInvoices;
        this.pendingInvoices = summary.pendingInvoices;
        this.overdueInvoices = summary.overdueInvoices;
      },
      error: (err) => {
        console.error('Failed to load invoice summary:', err);
      },
    });
  }

  loadDepartmentSummary(): void {
    const departmentCounts = new Map<string, number>();

    this.employeeList.forEach((employee) => {
      const department = employee.department?.trim();

      if (department) {
        departmentCounts.set(
          department,
          (departmentCounts.get(department) ?? 0) + 1,
        );
      }
    });

    this.departmentSummary = Array.from(departmentCounts, ([name, count]) => ({
      name,
      count,
    })).sort((a, b) => b.count - a.count);
  }
}
