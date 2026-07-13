import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../⚙️services/auth.service';
import { APP_ROUTES } from '../shared/constants/routes.constants';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService); // ✅ inject properly
  const router = inject(Router);
  
  if (authService.isLoggedIn()) {
    return true; // ✅ allow access
  }

  router.navigate([APP_ROUTES.LOGIN]); // ❌ redirect to login
  return false;
};
