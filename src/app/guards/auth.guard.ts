import { CanActivateFn } from "@angular/router";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

/**
 * Guard that allows access only if the user is authenticated.
 *
 * @function authGuard
 * @returns {boolean} True if the user is authenticated; otherwise, redirects to '/login' and returns false.
 */
export const authGuard = (): boolean => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};

/**
 * Guard that allows access only if the user is not authenticated.
 *
 * @function guestGuard
 * @returns {boolean} True if the user is not authenticated; otherwise, redirects to '/collections' and returns false.
 */
export const guestGuard = (): boolean => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    return true;
  } else {
    router.navigate(['/collections']);
    return false;
  }
};