import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/⚙️services/auth.service';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { APP_ROUTES } from '../../../shared/constants/routes.constants';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    InputTextModule,
    FloatLabelModule,
    ButtonModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  companyName = '';
  username = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';
  sucessMessage = '';

  constructor(
    private router: Router,
    private authServices: AuthService,
  ) {}

  register() {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Password do not match!';
      return;
    }
    this.authServices
      .registerApi(this.companyName, this.username, this.password)
      .subscribe({
        next: () => {
          this.sucessMessage =
            'Registration successful! Redirecting to login...';
          setTimeout(() => {
            this.router.navigate([APP_ROUTES.LOGIN]);
          }, 1500);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Registration failed!';
        },
      });
  }
}
