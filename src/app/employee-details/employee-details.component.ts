import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../services/employee.service';
import { Employee } from '../models/employee';

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [],
  templateUrl: './employee-details.component.html',
  styleUrl: './employee-details.component.scss',
})
export class EmployeeDetailsComponent {
  employee!: Employee;
  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
  ) {}
  ngOnInit() {
    const employeeId = this.route.snapshot.paramMap.get('id');
    if (employeeId) {
      this.employeeService.getEmployeeById(employeeId).subscribe({
        next: (data: Employee) => {
          this.employee = data;
        },
        error: (error) => {
          console.log(error);
        },
      });
    }
  }
}
