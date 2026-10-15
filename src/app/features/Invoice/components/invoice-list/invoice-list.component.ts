import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceService } from '../../../../core/⚙️services/invoice.service';
import { Invoice } from '../../models/invoice.model';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastService } from '../../../../core/⚙️services/toast.service';
import { ToastModule } from 'primeng/toast';
import { SUCCESS_MESSAGES, ERROR_MESSAGES,REQUIRED_MESSAGES } from '../../../../shared/constants/message.constants';

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, DialogModule, ToastModule],
  templateUrl: './invoice-list.component.html',
  styleUrl: './invoice-list.component.scss',
})
export class InvoiceListComponent implements OnInit {
  constructor(public toastMessageService: ToastService){}
  private invoiceService = inject(InvoiceService);

  invoices: Invoice[] = [];
  loading = false;
  errorMessage = '';
  showInvoiceDialog = false;
  saving = false;

  ngOnInit(): void {
    this.loadInvoices();
  }

  newInvoice = {
    invoiceNumber: '',
    supplierName: '',
    invoiceDate: '',
    dueDate: '',
    amount: 0,
    tax: 0,
    currency: 'INR',
    status: 'Pending' as 'Pending' | 'Paid' | 'Overdue',
  };

  openInvoiceDialog(): void {
    this.newInvoice = {
      invoiceNumber: '',
      supplierName: '',
      invoiceDate: '',
      dueDate: '',
      amount: 0,
      tax: 0,
      currency: 'INR',
      status: 'Pending',
    };

    this.showInvoiceDialog = true;
  }

  saveInvoice(): void {
    if (
      !this.newInvoice.invoiceNumber.trim() ||
      !this.newInvoice.supplierName.trim() ||
      !this.newInvoice.invoiceDate ||
      this.newInvoice.amount < 0 ||
      this.newInvoice.tax < 0
    ) {
      this.toastMessageService.error(REQUIRED_MESSAGES.REQUIRED_FIELDS);
      return;
    }

    this.saving = true;

    this.invoiceService
      .createInvoice({
        ...this.newInvoice,
        dueDate: this.newInvoice.dueDate || null,
      })
      .subscribe({
        next: () => {
          this.saving = false;
          this.showInvoiceDialog = false;
          this.toastMessageService.success(SUCCESS_MESSAGES.INVOICE_CREATED);
          this.loadInvoices();
        },

        error: (err) => {
          this.saving = false;
          this.toastMessageService.error(
            err.error?.message || ERROR_MESSAGES.INVOICE_CREATION_FAILD
          );
        },
      });
  }

  loadInvoices(): void {
    this.loading = true;
    this.errorMessage = '';

    this.invoiceService.getInvoices().subscribe({
      next: (response) => {
        this.invoices = response.invoices;
        this.loading = false;
      },
      error: (err) => {
        this.toastMessageService.error(
          err.error?.message|| ERROR_MESSAGES.INVOICE_LOADING_FAILD
        );
        this.loading = false;
      },
    });
  }
}
