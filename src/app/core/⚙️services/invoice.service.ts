import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Invoice } from '../../features/Invoice/models/invoice.model';

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

  private apiUrl = 'http://localhost:5000/api/invoices';

  // Fetch invoices with pagination
  getInvoices(
    page: number = 1,
    limit: number = 10,
  ): Observable<InvoiceListResponse> {
    const params = new HttpParams().set('page', page).set('limit', limit);

    return this.http.get<InvoiceListResponse>(this.apiUrl, { params });
  }

  // Fetch one invoice by ID
  getInvoiceById(id: string): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.apiUrl}/${id}`);
  }

  // Create a new invoice
  createInvoice(
    invoice: Omit<Invoice, '_id' | 'tenantId' | 'createdAt' | 'updatedAt'>,
  ): Observable<Invoice> {
    return this.http.post<Invoice>(this.apiUrl, invoice);
  }
}
