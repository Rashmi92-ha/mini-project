import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private router: Router) {}

  // Call this after login API responds
  login(token: string) {
    localStorage.setItem('token', token); // ✅ store real token
  }

  logout() {
    localStorage.removeItem('token'); // ✅ remove token
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); // ✅ check token
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
