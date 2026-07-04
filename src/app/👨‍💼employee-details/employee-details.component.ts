import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../⚙️services/employee.service';
import { Employee } from '../📦models/employee';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [UpperCasePipe], // ✅ removed NgIf — not needed with @if syntax
  templateUrl: './employee-details.component.html',
  styleUrl: './employee-details.component.scss',
})
export class EmployeeDetailsComponent implements OnInit {
  employee!: Employee;

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private router: Router,
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

  backLogin() {
    this.router.navigate(['/dashboard']);
  }
}
