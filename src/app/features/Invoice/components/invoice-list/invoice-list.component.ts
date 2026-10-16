import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import {
  Subject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { InvoiceService } from '../../../../core/⚙️services/invoice.service';
import { ToastService } from '../../../../core/⚙️services/toast.service';
import { Invoice } from '../../models/invoice.model';
import {
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
  REQUIRED_MESSAGES,
} from '../../../../shared/constants/message.constants';
import {
  NEW_INVOICE,
  OPEN_DIALOG,
} from '../../../../shared/constants/invoice.constants';
import {
  INVOICE_STATUS,
  INVOICE_STATUS_OPTIONS,
} from '../../../../shared/constants/status.constants';

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
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    DialogModule,
    ToastModule,
    TableModule,
  ],
  templateUrl: './invoice-list.component.html',
  styleUrl: './invoice-list.component.scss',
})
export class InvoiceListComponent implements OnInit {
  private invoiceService = inject(InvoiceService);
  private toastMessageService = inject(ToastService);
  private destroyRef = inject(DestroyRef);

  invoices: Invoice[] = [];
  loading = false;
  errorMessage = '';
  showInvoiceDialog = false;
  saving = false;
  editingInvoiceId: string | null = null;
  newInvoice: InvoiceForm = { ...NEW_INVOICE };
  sortField = 'createdAt';
  sortOrder = -1;

  searchTerm = '';
  selectedStatus = 'All';
  statusOptions = INVOICE_STATUS_OPTIONS; // includes "All", used by the filter
  formStatusOptions = INVOICE_STATUS_OPTIONS.filter((o) => o.value !== 'All'); // used by the dialog

  currentPage = 1;
  pageSize = 10;
  totalInvoices = 0;

  private search$ = new Subject<string>();
  private load$ = new Subject<void>();

  ngOnInit(): void {
    // Every load goes through here, so an older response can never overwrite a newer one
    this.load$
      .pipe(
        tap(() => {
          this.loading = true;
          this.errorMessage = '';
        }),
        switchMap(() =>
          this.invoiceService
            .getInvoices(
              this.currentPage,
              this.pageSize,
              this.searchTerm.trim(),
              this.selectedStatus,
              this.sortField,
              this.sortOrder,
            )
            .pipe(
              catchError((err: HttpErrorResponse) => {
                this.errorMessage =
                  err.error?.message || ERROR_MESSAGES.INVOICE_LOADING_FAILD;
                this.toastMessageService.error(this.errorMessage);
                return of(null);
              }),
            ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((response) => {
        this.loading = false;
        if (response) {
          this.invoices = response.invoices ?? [];
          this.totalInvoices = response.total ?? 0;
        }
      });

    // Wait until the user stops typing before calling the API
    this.search$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.currentPage = 1;
        this.loadInvoices();
      });

    this.loadInvoices();
  }

  loadInvoices(): void {
    this.load$.next();
  }

  onSearchChange(value: string): void {
    this.searchTerm = value;
    this.search$.next(value.trim());
  }

  onStatusChange(value: string): void {
    this.selectedStatus = value;
    this.currentPage = 1;
    this.loadInvoices();
  }

  // Called by the table when the user changes the page or the rows per page
  onLazyLoad(event: TableLazyLoadEvent): void {
    this.pageSize = event.rows ?? this.pageSize;
    this.currentPage = Math.floor((event.first ?? 0) / this.pageSize) + 1;
    if (typeof event.sortField === 'string' && event.sortField) {
      this.sortField = event.sortField;
    }

    if (event.sortOrder === 1 || event.sortOrder === -1) {
      this.sortOrder = event.sortOrder;
    }
    this.loadInvoices();
  }

  openInvoiceDialog(): void {
    this.editingInvoiceId = null;
    this.newInvoice = {
      ...OPEN_DIALOG,
      status: INVOICE_STATUS.PENDING,
    };
    this.showInvoiceDialog = true;
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

  saveInvoice(): void {
    if (this.saving) return;

    if (!this.isFormValid()) {
      this.toastMessageService.error(REQUIRED_MESSAGES.REQUIRED_FIELDS);
      return;
    }

    if (
      this.newInvoice.dueDate &&
      this.newInvoice.dueDate < this.newInvoice.invoiceDate
    ) {
      this.toastMessageService.error(
        'Due date cannot be before the invoice date',
      );
      return;
    }

    this.saving = true;

    const invoiceData = {
      ...this.newInvoice,
      tax: this.newInvoice.tax ?? 0, // an empty tax field becomes 0
      dueDate: this.newInvoice.dueDate || null,
    };

    const isEdit = !!this.editingInvoiceId;
    const request = this.editingInvoiceId
      ? this.invoiceService.updateInvoice(this.editingInvoiceId, invoiceData)
      : this.invoiceService.createInvoice(invoiceData);

    request.subscribe({
      next: () => {
        this.saving = false;
        this.showInvoiceDialog = false;
        this.toastMessageService.success(
          isEdit
            ? SUCCESS_MESSAGES.INVOICE_UPDATED
            : SUCCESS_MESSAGES.INVOICE_CREATED,
        );
        this.editingInvoiceId = null;
        this.loadInvoices();
      },
      error: (err: HttpErrorResponse) => {
        this.saving = false;
        this.toastMessageService.error(
          err.error?.message ||
            (isEdit
              ? 'Failed to update invoice'
              : ERROR_MESSAGES.INVOICE_CREATION_FAILD),
        );
      },
    });
  }

  private isMoney(value: unknown): boolean {
    return typeof value === 'number' && Number.isFinite(value) && value >= 0;
  }

  private isFormValid(): boolean {
    const f = this.newInvoice;
    return (
      !!f.invoiceNumber.trim() &&
      !!f.supplierName.trim() &&
      !!f.invoiceDate &&
      !!f.currency?.trim() &&
      this.isMoney(f.amount) &&
      (f.tax == null || this.isMoney(f.tax))
    );
  }
}
