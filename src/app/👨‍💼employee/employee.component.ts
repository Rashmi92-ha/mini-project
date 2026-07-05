import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Employee } from  '../👨‍💼employee/📦models/employee';
import { EmployeeService } from '../⚙️services/employee.service';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss',
})
export class EmployeeComponent {
  constructor(private employeeService: EmployeeService) {}

  employeeForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    department: new FormControl('', Validators.required),
    role: new FormControl('', Validators.required),
    salary: new FormControl('', Validators.required),
  });
  successMessage: any;
  employeeList: Employee[] = [];
  editId: string | null = null;

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
        salary: Number(formValue.salary) ?? 0,
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
              this.successMessage = 'Employee updated successfully ✅';
              this.editId = null;
              this.employeeForm.reset();
            },
            error: (err) => console.error('Update failed', err),
          });
      } else {
        // Add new employee
        this.employeeService.addEmployee(employeeData).subscribe({
          next: (response) => {
            this.employeeList.push(response);
            this.successMessage = 'Employee added successfully ✅';
            this.employeeForm.reset();
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
    this.employeeService.deleteEmployee(id).subscribe({
      next: () => {
        this.employeeList = this.employeeList.filter((e) => e._id !== id);
      },
      error: (err) => console.error('Delete failed', err),
    });
  }

  editEmployee(employee: Employee) {
    this.editId = employee._id ?? null;
    this.employeeForm.patchValue({
      name: employee.name,
      email: employee.email,
      department: employee.department,
      role: employee.role,
      salary: employee.salary.toString(),
    });
  }

  loadEmployees() {
    this.employeeService.getEmployee().subscribe({
      next: (data: Employee[]) => {
        this.employeeList = data;
      },
    });
  }
}
