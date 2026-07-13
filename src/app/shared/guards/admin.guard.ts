import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../⚙️services/auth.service';
import { APP_ROUTES } from '../constants/routes.constants';

export const adminGuard: CanActivateFn = (route, state) => {
  const authServices = inject(AuthService);
  const router = inject(Router);

  if(authServices.isAdmin()){
    return true;
  }
  router.navigate([APP_ROUTES.DASHBOARD]);
  return false;
};
