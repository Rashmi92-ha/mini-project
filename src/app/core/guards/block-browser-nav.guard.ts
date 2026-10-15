import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';

export const blockBrowserNavGuard: CanActivateChildFn = () => {
  const router = inject(Router);
  const navigation = router.getCurrentNavigation();
  return navigation?.trigger !== 'popstate';
};