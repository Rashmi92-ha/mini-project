import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { API_ENPOINTS } from '../shared/constants/api.constants';
import { APP_ROUTES } from '../shared/constants/routes.constants';
import { USER_ROLES } from '../shared/constants/userRole.constants';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
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
      .post<any>(API_ENPOINTS.AUTH.LOGIN, { username, password })
      .pipe(
        map((response) => {
          if (response.token && response.refreshToken) {
            this.login(response.token, response.refreshToken);
            return true;
          }
          return false;
        }),
      );
  }

  registerApi(companyName: string, username: string, password: string): Observable<any> {
    return this.httpClient.post<any>(API_ENPOINTS.AUTH.REGISTER, {
      companyName,
      username,
      password,
    });
  }
  // Call this after login API responds
  login(token: string, refreshToken: string) {
    localStorage.setItem('token', token); // ✅ store real token
    localStorage.setItem('refreshToken', refreshToken);
    this.scheduleAutoLogout();
  }

  logout() {
    const refreshToken = this.getRefreshToken();
    if (refreshToken) {
      this.httpClient
        .post(API_ENPOINTS.AUTH.LOGOUT, { refreshToken })
        .subscribe();
    }
    localStorage.removeItem('token'); // ✅ remove token
    localStorage.removeItem('refreshToken');
    clearTimeout(this.logoutTimer);
    this.router.navigate([APP_ROUTES.LOGIN]);
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

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
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

  getUserRole(): string| null{
    return this.getTokenPayload()?.role ?? null;
  }

  isAdmin(): boolean {
    return this.getUserRole() === USER_ROLES.ADMIN;
  }

  isUser(): boolean {
    return this.getUserRole() === USER_ROLES.USER;
  }

  refreshAccessToken(): Observable<boolean> {
    const refreshToken = this.getRefreshToken();
    return this.httpClient
      .post<any>(API_ENPOINTS.AUTH.REFRESH, { refreshToken })
      .pipe(
        map((response) => {
          if (response.token) {
            localStorage.setItem('token', response.token);
            this.scheduleAutoLogout();
            return true;
          }
          return false;
        }),
      );
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
      this.attemptRefreshOrLogout();
      return;
    }
    this.logoutTimer = setTimeout(() => {
      this.attemptRefreshOrLogout();
    }, expiresInMs);
  }

  private attemptRefreshOrLogout() {
    this.refreshAccessToken().subscribe({
      next: (success) => {
        if (!success) {
          this.logout();
        }
      },
      error: () => {
        this.logout();
      },
    });
  }
}
