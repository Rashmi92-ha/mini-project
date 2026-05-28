import { Component } from '@angular/core';
import { EmployeeComponent } from '../app/employee/employee.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  imports: [EmployeeComponent],
})
export class AppComponent {
  title = 'employee-management';
}
