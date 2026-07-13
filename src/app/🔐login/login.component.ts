import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../⚙️services/auth.service';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { APP_ROUTES } from '../shared/constants/routes.constants';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, ButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  login() {
    this.authService.loginApi(this.username, this.password).subscribe({
      next: (success) => {
        if (success) {
          this.router.navigate([APP_ROUTES.DASHBOARD]);
        } else {
          this.errorMessage = 'Invalid username or password';
        }
      },
      error: (err) => {
        this.errorMessage = 'Something went wrong. Try again!';
        console.error(err);
      },
    });
  }
}
