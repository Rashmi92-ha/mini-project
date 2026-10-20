import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DashboardStats {
  employees: {
    total: number;
    active: number;
    inactive: number;
  };
  departments: {
    total: number;
  };
  invoices: {
    total: number;
    paid: number;
    pending: number;
    overdue: number;
  };
}

export interface DashboardInsightsResponse {
  stats: DashboardStats;
  insights: string[];
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private http = inject(HttpClient);

  getInsights(): Observable<DashboardInsightsResponse> {
    return this.http.get<DashboardInsightsResponse>(
      `${environment.apiUrl}/api/dashboard/insights`,
    );
  }
}
