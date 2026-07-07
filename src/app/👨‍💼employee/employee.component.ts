import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Employee } from '../👨‍💼employee/📦models/employee';
import { EmployeeService } from '../⚙️services/employee.service';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { InputNumberModule } from 'primeng/inputnumber';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DropdownModule } from 'primeng/dropdown';
@Component({
  selector: 'app-employee',
  standalone: true,
  providers: [MessageService, ConfirmationService],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterLink,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    FormsModule,
    ToastModule,
    ConfirmDialogModule,
    FloatLabelModule,
    InputNumberModule,
    DropdownModule,
  ],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss',
})
export class EmployeeComponent {
  constructor(
    private employeeService: EmployeeService,
    private messageService: MessageService,
    private confirmService: ConfirmationService,
  ) {}

  employeeForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    department: new FormControl('', Validators.required),
    role: new FormControl('', Validators.required),
    salary: new FormControl<number | null>(null, Validators.required),
  });
  successMessage: any;
  employeeList: Employee[] = [];
  filteredEmployees: Employee[] = [];
  editId: string | null = null;
  displayDialog = false;
  searchText = '';
  departments = [
    { name: 'IT', value: 'IT' },
    { name: 'HR', value: 'HR' },
    { name: 'Finance', value: 'Finance' },
    { name: 'Sales', value: 'Sales' },
    { name: 'Marketing', value: 'Marketing' },
  ];
  roles = [
    { name: 'Developer', value: 'Developer' },
    { name: 'Manager', value: 'Manager' },
    { name: 'HR', value: 'HR' },
    { name: 'Tester', value: 'Tester' },
    { name: 'Admin', value: 'Admin' },
  ];
  ngOnInit() {
    this.loadEmployees();
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      const formValue = this.employeeForm.value;
      const employeeData: Employee = {
        name: formValue.name ?? '',
        email: formValue.email ?? '',
        department: formValue.department ?? '',
        role: formValue.role ?? '',
        salary: formValue.salary ?? 0,
      };
      if (this.editId !== null) {
        this.employeeService
          .updateEmployee({ ...employeeData, _id: this.editId })
          .subscribe({
            next: (updated) => {
              const index = this.employeeList.findIndex(
                (e) => e._id === this.editId,
              );
              if (index !== -1) {
                this.employeeList[index] = updated;
              }
              this.messageService.add({
                severity: 'success',
                summary: 'Updated',
                detail: 'Employee updated successfully',
              });
              this.editId = null;
              this.employeeForm.reset();
              this.displayDialog = false;
            },
            error: (err) => console.error('Update failed', err),
          });
      } else {
        // Add new employee
        this.employeeService.addEmployee(employeeData).subscribe({
          next: (response) => {
            this.employeeList.push(response);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Employee added successfully',
            });
            this.employeeForm.reset();
            this.displayDialog = false;
          },
          error: (err) => console.error('Add failed', err),
        });
      }
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.employeeForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  hasError(fieldName: string, errorName: string): boolean {
    return !!this.employeeForm.get(fieldName)?.hasError(errorName);
  }

  deleteEmployee(id: string) {
    this.confirmService.confirm({
      header: 'Delete Employee',
      message: 'Are you sure you want to delete this employee',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.employeeService.deleteEmployee(id).subscribe({
          next: () => {
            this.employeeList = this.employeeList.filter((e) => e._id !== id);
            this.messageService.add({
              severity: 'success',
              summary: 'Deleted',
              detail: 'Employee deleted successfully',
            });
            this.loadEmployees();
          },
          error: (err) => console.error('Delete failed', err),
        });
      },
    });
  }

  editEmployee(employee: Employee) {
    this.editId = employee._id ?? null;
    this.employeeForm.patchValue({
      name: employee.name,
      email: employee.email,
      department: employee.department,
      role: employee.role,
      salary: employee.salary,
    });
    this.displayDialog = true;
  }

  loadEmployees() {
    this.employeeService.getEmployee().subscribe({
      next: (data: Employee[]) => {
        this.employeeList = data;
        this.filteredEmployees = data;
      },
    });
  }

  openDialog() {
    this.employeeForm.reset();
    this.editId = null;
    this.displayDialog = true;
  }

  closeDialog() {
    this.displayDialog = false;
  }

  filterEmployee() {
    const search = this.searchText.toLowerCase();
    this.filteredEmployees = this.employeeList.filter(
      (employee) =>
        employee.name.toLowerCase().includes(search) ||
        employee.email.toLowerCase().includes(search) ||
        employee.department.toLowerCase().includes(search) ||
        employee.role.toLowerCase().includes(search),
    );
  }
}
