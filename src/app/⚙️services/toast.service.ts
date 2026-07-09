import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private messageService: MessageService) {}

  success(detail: string, summary = 'Success'): void {
    this.messageService.add({
      severity: 'success',
      summary,
      detail,
    });
  }

  error(detail: string): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail,
    });
  }

  warning(detail: string): void {
    this.messageService.add({
      severity: 'warn',
      summary: 'Warning',
      detail,
    });
  }

  info(detail: string): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail,
    });
  }
}
