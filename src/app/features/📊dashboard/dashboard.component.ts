import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { EmployeeService } from '../../core/⚙️services/employee.service';
import { Employee } from '../👨‍💼employee/📦models/employee';
import {
  InvoiceService,
  InvoiceSummary,
} from '../../core/⚙️services/invoice.service';
import { DepartmentService } from '../../core/⚙️services/department.service';
import { Department } from '../department/models/department.model';
import {
  DashboardService,
  DashboardInsightsResponse,
} from '../../core/⚙️services/dashboard.service';
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

  departmentSummary: {
    id: string;
    name: string;
    count: number;
  }[] = [];

  totalEmployee = 0;
  totalEmail = 0;
  totalDepartment = 0;
  totalActive = 0;

  totalInvoices = 0;
  paidInvoices = 0;
  pendingInvoices = 0;
  overdueInvoices = 0;

  insights: string[] = [];
  insightsLoading = false;
  insightsError = '';

  private employeeService = inject(EmployeeService);
  private invoiceService = inject(InvoiceService);
  private departmentService = inject(DepartmentService);
  private dashboardService = inject(DashboardService);

  ngOnInit(): void {
    this.employeeService.getEmployee().subscribe({
      next: (data) => {
        this.employeeList = data;

        this.totalEmployee = this.employeeList.length;

        this.totalEmail = this.employeeList.filter(
          (employee) => employee.email,
        ).length;

        this.totalActive = this.employeeList.filter(
          (employee) => employee.status === 'Active',
        ).length;

        this.loadDepartmentSummary();
        this.loadDashboardInsights();
      },
      error: (error) => {
        console.error('Failed to load employees:', error);
      },
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
      error: (error) => {
        console.error('Failed to load invoice summary:', error);
      },
    });
  }

  loadDepartmentSummary(): void {
    this.departmentService.getDepartments().subscribe({
      next: (departments: Department[]) => {
        const departmentCounts = new Map<string, number>();

        this.employeeList.forEach((employee) => {
          const name = employee.department?.trim().toLowerCase();

          if (name) {
            departmentCounts.set(name, (departmentCounts.get(name) ?? 0) + 1);
          }
        });

        this.departmentSummary = departments
          .map((department) => ({
            id: department._id,
            name: department.name,
            count:
              departmentCounts.get(department.name.trim().toLowerCase()) ?? 0,
          }))
          .sort((a, b) => b.count - a.count);

        this.totalDepartment = departments.length;
      },
      error: (error) => {
        console.error('Failed to load department summary:', error);
      },
    });
  }
  loadDashboardInsights(): void {
    this.insightsLoading = true;
    this.insightsError = '';

    this.dashboardService.getInsights().subscribe({
      next: (response: DashboardInsightsResponse) => {
        this.insights = response.insights;
        this.insightsLoading = false;
      },
      error: (error) => {
        console.error('Failed to load dashboard insights:', error);
        this.insightsError = 'Unable to load dashboard insights.';
        this.insightsLoading = false;
      },
    });
  }
}
