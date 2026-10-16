import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Invoice } from '../../features/Invoice/models/invoice.model';
import { API_ENPOINTS } from '../../shared/constants/api.constants';

export interface InvoiceListResponse {
  invoices: Invoice[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private http = inject(HttpClient);

  private apiUrl = API_ENPOINTS.AUTH.INVOICE;

  // Fetch invoices with pagination
  getInvoices(
    page = 1,
    limit = 10,
    search = '',
    status = 'All',
    sortField = 'createdAt',
    sortOrder = -1,
  ): Observable<{
    invoices: Invoice[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    let params = new HttpParams()
      .set('page', page)
      .set('limit', limit)
      .set('sortField', sortField)
      .set('sortOrder', sortOrder);

    if (search) {
      params = params.set('search', search);
    }

    if (status !== 'All') {
      params = params.set('status', status);
    }

    return this.http.get<{
      invoices: Invoice[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>(this.apiUrl, { params });
  }

  // Fetch one invoice by ID
  getInvoiceById(id: string): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.apiUrl}/${id}`);
  }

  updateInvoice(
    id: string,
    invoice: Omit<Invoice, '_id' | 'tenantId' | 'createdAt' | 'updatedAt'>,
  ): Observable<Invoice> {
    return this.http.put<Invoice>(`${this.apiUrl}/${id}`, invoice);
  }

  // Create a new invoice
  createInvoice(
    invoice: Omit<Invoice, '_id' | 'tenantId' | 'createdAt' | 'updatedAt'>,
  ): Observable<Invoice> {
    return this.http.post<Invoice>(this.apiUrl, invoice);
  }

  deleteInvoice(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
