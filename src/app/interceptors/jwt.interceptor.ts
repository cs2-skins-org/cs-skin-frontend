// src/app/interceptors/jwt.interceptor.ts
import { Injectable, inject } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Interceptor for attaching a JWT token to HTTP requests and handling unauthorized errors.
 *
 * @class JwtInterceptor
 * @implements {HttpInterceptor}
 */
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  /**
   * Instance of AuthService for managing authentication operations.
   * @private
   */
  private authService = inject(AuthService);

  /**
   * Instance of Router for handling navigation.
   * @private
   */
  private router = inject(Router);

  /**
   * Intercepts HTTP requests to add a JWT token in the Authorization header if available,
   * and handles 401 Unauthorized errors by logging out the user and redirecting to the login page.
   *
   * @param {HttpRequest<any>} request - The outgoing HTTP request.
   * @param {HttpHandler} next - The next interceptor in the chain.
   * @returns {Observable<HttpEvent<any>>} An observable of the HTTP event stream.
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the auth token from the service
    const token = this.authService.getToken();
    
    // Add auth header with JWT token if available
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle 401 Unauthorized errors
        if (error.status === 401) {
          // Token might be expired or invalid; log out the user and redirect to login
          this.authService.logout();
          this.router.navigate(['/login']);
        }
        
        return throwError(() => error);
      })
    );
  }
}