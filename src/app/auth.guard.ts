import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {

  const isLoggedIn = localStorage.getItem('isLoggedIn');
  return isLoggedIn === 'true';
};
