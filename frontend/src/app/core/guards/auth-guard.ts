import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const store = inject(AuthService);

  if (store.isAuthenticated()) return true;

  router.navigate(["/"]);
  return false;
};
