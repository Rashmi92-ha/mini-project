import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../services/employee.service';
import { Employee } from '../models/employee';
import { UpperCasePipe, NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [UpperCasePipe, NgIf],
  templateUrl: './employee-details.component.html',
  styleUrl: './employee-details.component.scss',
})
export class EmployeeDetailsComponent implements OnInit {
  employee!: Employee;
  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private router : Router,
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
    backLogin(){
     this.router.navigate(['/dashboard']); 
  }
}
