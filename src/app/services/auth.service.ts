import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(
    private router: Router,
    private httpClient: HttpClient,
  ) {}

  // 🔥 NEW — calls real backend to login
  loginApi(username: string, password: string): Observable<boolean> {
    return this.httpClient
      .post<any>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        map((response) => {
          if (response.token) {
            this.login(response.token);
            return true;
          }
          return false;
        }),
      );
  }

  registerApi(username: string, password: string): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrl}/register`, {
      username,
      password,
    });
  }
  // Call this after login API responds
  login(token: string) {
    localStorage.setItem('token', token); // ✅ store real token
  }

  logout() {
    localStorage.removeItem('token'); // ✅ remove token
    this.router.navigate(['/login-page']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); // ✅ check token
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
