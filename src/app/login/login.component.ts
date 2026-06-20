import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  login() {
    // Hardcoded check — replace with real API later in Phase 4
    if (this.username === 'UnknowUser' && this.password === 'User@123') {
      // Fake JWT token — replace with real API response in Phase 4
      const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fake.token';

      this.authService.login(fakeToken); // ✅ stores token
      this.router.navigate(['/dashboard']);
    } else {
      alert('Invalid username or password!');
    }
  }
}
