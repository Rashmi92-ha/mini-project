import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Employee } from '../models/employee';
import { EmployeeService } from '../services/employee.service';
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
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]{10}$'),
    ]),
    designation: new FormControl('', Validators.required),
    salary: new FormControl('', Validators.required),
  });
  successMessage: any;
  employeeList: Employee[] = [];
  editIndex: number | null = null;

  ngOnInit() {
    this.loadEmployees();
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      const formValue = this.employeeForm.value;

      const employeeData: Employee = {
        id: this.editIndex !== null ? this.employeeList[this.editIndex].id : 0,
        name: formValue.name ?? '',
        email: formValue.email ?? '',
        phone: formValue.phone ?? '',
        designation: formValue.designation ?? '',
        salary: formValue.salary ?? 0,
      };

      if (this.editIndex !== null) {
        this.employeeService.updateEmployee(employeeData).subscribe({
          next: () => {
            this.employeeList[this.editIndex!] = employeeData;
            this.successMessage = 'Employee updated successfully ✅';
            this.editIndex = null;
            this.employeeForm.reset();
          },
          error: (err) => console.error('Update failed', err),
        });
      } else {
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

  deleteEmployee(index: number) {
    this.employeeList.splice(index, 1);
  }

  editEmployee(employee: Employee, index: number) {
    this.editIndex = index;
    this.employeeForm.patchValue({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      designation: employee.designation,
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
