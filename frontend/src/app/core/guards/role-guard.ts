import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const roleGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const expectedRoles = route.data["expectedRoles"] as string[] || [];
  const roles = auth.getUserRoles();
  console.log('Expected roles:', expectedRoles);
  console.log('User roles from token:', roles);
  const hasExpectedRoles = expectedRoles.some(role => roles.includes(role));
  if (hasExpectedRoles) return true;

  router.navigate(['/unauthorized'])
  return false;
};
