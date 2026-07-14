import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Employee, EmployeeStatus } from '../👨‍💼employee/📦models/employee';
import { EmployeeService } from '../../core/⚙️services/employee.service';
import { ToastService } from '../../core/⚙️services/toast.service';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { InputNumberModule } from 'primeng/inputnumber';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { DEPARTMENTS } from '../../shared/constants/department.constants';
import { ROLE } from '../../shared/constants/role.constants';
import { STATUS, STATUS_OPTIONS } from '../../shared/constants/status.constants';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../../shared/constants/message.constants';
@Component({
  selector: 'app-employee',
  standalone: true,
  providers: [ConfirmationService],
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
    TagModule,
  ],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss',
})
export class EmployeeComponent {
  constructor(
    private employeeService: EmployeeService,
    private confirmService: ConfirmationService,
    private toastService: ToastService,
  ) {}

  employeeForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    department: new FormControl('', Validators.required),
    role: new FormControl('', Validators.required),
    salary: new FormControl<number | null>(null, Validators.required),
    status: new FormControl<EmployeeStatus>(STATUS.ACTIVE, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  employeeList: Employee[] = [];
  filteredEmployees: Employee[] = [];
  editId: string | null = null;
  displayDialog = false;
  loading = false;
  searchText = '';
  departments = DEPARTMENTS;
  roles = ROLE;
  statusList = STATUS_OPTIONS;

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
        status: formValue.status ?? STATUS.ACTIVE,
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
              this.toastService.success(SUCCESS_MESSAGES.EMPLOYEE_UPDATED)
              this.editId = null;
              this.employeeForm.reset();
              this.displayDialog = false;
            },
            error: (err) => {console.error(err)
              this.toastService.error(
                err.error?.message || ERROR_MESSAGES.EMPLOYEE_UPDATE
              )
            },
          });
      } else {
        // Add new employee
        this.employeeService.addEmployee(employeeData).subscribe({
          next: (response) => {
            this.employeeList.push(response);
            this.toastService.success(SUCCESS_MESSAGES.EMPLOYEE_CREATED)
            this.employeeForm.reset();
            this.displayDialog = false;
          },
           error: (err) => {
            console.error(err);
            this.toastService.error(
              err.error?.message || ERROR_MESSAGES.EMPLOYEE_CREATE
            )
          },
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
            this.toastService.success(SUCCESS_MESSAGES.EMPLOYEE_DELETED);
            this.loadEmployees();
          },
          error: (err) => {
            console.error(err);
            this.toastService.error(
              err.error?.message || ERROR_MESSAGES.EMPLOYEE_DELETE
            )
          },
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
      status: employee.status,
    });
    this.displayDialog = true;
  }

  loadEmployees() {
    this.loading = true;

    this.employeeService.getEmployee().subscribe({
      next: (data) => {
        this.employeeList = data;
        this.filteredEmployees = data;
      },
      error: (err) => {
        console.error(err);
        this.toastService.error(ERROR_MESSAGES.EMPLOYEE_LOAD)
      },
      complete: () => {
        this.loading = false;
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

  getStatusSeverity(status: string) {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Inactive':
        return 'danger';
      default:
        return 'secondary';
    }
  }
}
