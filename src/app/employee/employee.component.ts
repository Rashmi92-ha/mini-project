import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Employee } from '../models/employee';
@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss',
})
export class EmployeeComponent {
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

  onSubmit() {
    if (this.employeeForm.valid) {
      const employeeData = this.employeeForm.value as unknown as Employee;
      if (this.editIndex !== null) {
        this.employeeList[this.editIndex] = employeeData;
        this.successMessage = alert('Employee updated successfully ✅');
        this.editIndex = null;
      } else {
        this.employeeList.push(employeeData);
        this.successMessage = alert('Employee added successfully ✅');
      } 
      this.employeeForm.reset();
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.employeeForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  hasError(fieldName: string, errorName: string): boolean {
    return !!this.employeeForm.get(fieldName)?.hasError(errorName);
  }

  isDeleteEmplyoee(index: number) {
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
}
