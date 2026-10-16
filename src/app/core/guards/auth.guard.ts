import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../⚙️services/auth.service';
import { APP_ROUTES } from '../../shared/constants/routes.constants';

export const authGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  router.createUrlTree([APP_ROUTES.LOGIN]);
  return false;
};