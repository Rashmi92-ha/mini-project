import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/users`;
  private logoutTimer: any;

  constructor(
    private router: Router,
    private httpClient: HttpClient,
  ) {
    this.scheduleAutoLogout();
  }

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
    this.scheduleAutoLogout();
  }

  logout() {
    clearTimeout(this.logoutTimer);
    localStorage.removeItem('token'); // ✅ remove token
    this.router.navigate(['/login-page']);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    if (this.isTokenExpired()) {
      this.logout();
      return false;
    }
    return true;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getTokenPayload(): any | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    try {
      return jwtDecode(token);
    } catch (error) {
      return null;
    }
  }

  isTokenExpired(): boolean {
    const payload = this.getTokenPayload();

    if (!payload || !payload.exp) {
      return true;
    }
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  }

  private scheduleAutoLogout() {
    clearTimeout(this.logoutTimer);

    const payload = this.getTokenPayload();
    if (!payload || !payload.exp) {
      return;
    }
    const expiresInMs = payload.exp * 1000 - Date.now();

    if (expiresInMs <= 0) {
      this.logout();
      return;
    }
    this.logoutTimer = setTimeout(() => {
      this.logout();
    }, expiresInMs);
  }
}
