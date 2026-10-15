import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../⚙️services/auth.service';
import { APP_ROUTES } from '../../shared/constants/routes.constants';

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn()
    ? router.createUrlTree([APP_ROUTES.DASHBOARD])
    : true;
};