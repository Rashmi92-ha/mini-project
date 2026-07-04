import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Employee } from '../📦models/employee';

@Component({
  selector: 'app-employee-card',
  standalone: true,
  imports: [],
  templateUrl: './employee-card.component.html',
  styleUrl: './employee-card.component.scss',
})
export class EmployeeCardComponent {
  @Input()
  employee!: Employee;

  @Output() deleteEmployee = new EventEmitter<string>(); // ✅ changed from number to string

  delete() {
    this.deleteEmployee.emit(this.employee._id); // ✅ changed from .id to ._id
  }
}
