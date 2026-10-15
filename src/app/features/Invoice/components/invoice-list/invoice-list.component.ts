import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceService } from '../../../../core/⚙️services/invoice.service';
import { Invoice } from '../../models/invoice.model';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastService } from '../../../../core/⚙️services/toast.service';
import { ToastModule } from 'primeng/toast';
import {
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
  REQUIRED_MESSAGES,
} from '../../../../shared/constants/message.constants';
import {
  NEW_INVOICE,
  OPEN_DIALOG,
} from '../../../../shared/constants/invoice.constants';
type InvoiceForm = {
  invoiceNumber: string;
  supplierName: string;
  invoiceDate: string;
  dueDate: string;
  amount: number;
  tax: number;
  currency: string;
  status: 'Pending' | 'Paid' | 'Overdue';
};
@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, DialogModule, ToastModule],
  templateUrl: './invoice-list.component.html',
  styleUrl: './invoice-list.component.scss',
})
export class InvoiceListComponent implements OnInit {
  constructor(public toastMessageService: ToastService) {}
  private invoiceService = inject(InvoiceService);

  invoices: Invoice[] = [];
  loading = false;
  errorMessage = '';
  showInvoiceDialog = false;
  saving = false;
  editingInvoiceId: string | null = null;

  ngOnInit(): void {
    this.loadInvoices();
  }

  newInvoice: InvoiceForm = { ...NEW_INVOICE };

  openInvoiceDialog(): void {
    this.editingInvoiceId = null;
    this.newInvoice = {
      ...OPEN_DIALOG,
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

    const invoiceData = {
      ...this.newInvoice,
      dueDate: this.newInvoice.dueDate || null,
    };

    const request = this.editingInvoiceId
      ? this.invoiceService.updateInvoice(this.editingInvoiceId, invoiceData)
      : this.invoiceService.createInvoice(invoiceData);

    request.subscribe({
      next: () => {
        this.saving = false;
        this.showInvoiceDialog = false;

        if (this.editingInvoiceId) {
          this.toastMessageService.success(SUCCESS_MESSAGES.INVOICE_UPDATED);
        } else {
          this.toastMessageService.success(SUCCESS_MESSAGES.INVOICE_CREATED);
        }

        this.editingInvoiceId = null;
        this.loadInvoices();
      },
      error: (err) => {
        this.saving = false;
        this.toastMessageService.error(
          err.error?.message ||
            (this.editingInvoiceId
              ? 'Failed to update invoice'
              : ERROR_MESSAGES.INVOICE_CREATION_FAILD),
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
          err.error?.message || ERROR_MESSAGES.INVOICE_LOADING_FAILD,
        );
        this.loading = false;
      },
    });
  }

  editInvoice(invoice: Invoice): void {
    if (!invoice._id) {
      this.toastMessageService.error(ERROR_MESSAGES.INVALID_ID);
      return;
    }

    this.editingInvoiceId = invoice._id;
    this.newInvoice = {
      invoiceNumber: invoice.invoiceNumber,
      supplierName: invoice.supplierName,
      invoiceDate: invoice.invoiceDate.substring(0, 10),
      dueDate: invoice.dueDate ? invoice.dueDate.substring(0, 10) : '',
      amount: invoice.amount,
      tax: invoice.tax,
      currency: invoice.currency,
      status: invoice.status,
    };
    this.showInvoiceDialog = true;
  }
}
