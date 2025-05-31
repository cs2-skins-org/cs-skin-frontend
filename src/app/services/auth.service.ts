// src/app/services/auth.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginResponse } from '../models/interfaces';
import { BalanceService } from './balance.service';

/**
 * Service for handling authentication operations.
 *
 * @class AuthService
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /**
   * HttpClient instance for making HTTP requests.
   * @private
   */
  private http = inject(HttpClient);

  /**
   * BalanceService instance to manage user balance.
   * @private
   */
  private balanceService = inject(BalanceService);

  /**
   * Base API URL for authentication endpoints.
   * @private
   */
  private apiUrl = 'http://localhost:3000/auth'; // Adjust to your backend URL

  /**
   * BehaviorSubject for storing and emitting authentication token.
   * @private
   */
  private tokenSubject = new BehaviorSubject<string | null>(this.getToken());

  /**
   * Observable stream of the authentication token.
   */
  public token$ = this.tokenSubject.asObservable();

  /**
   * Logs in a user with the provided email and password.
   *
   * @param {string} email - The user's email.
   * @param {string} password - The user's password.
   * @returns {Observable<LoginResponse>} An observable containing the login response.
   */
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          this.setToken(response.access_token);
        })
      );
  }

  /**
   * Registers a new user with the provided email, password, and username.
   *
   * @param {string} email - The user's email.
   * @param {string} password - The user's password.
   * @param {string} username - The user's username.
   * @returns {Observable<any>} An observable of the registration response.
   */
  register(email: string, password: string, username: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { email, password, username });
  }

  /**
   * Logs out the current user by removing the token and resetting the balance.
   *
   * @returns {void}
   */
  logout(): void {
    localStorage.removeItem('cs2_token');
    this.tokenSubject.next(null);
    // Reset balance when logging out
    this.balanceService.resetBalance();
  }

  /**
   * Checks if the user is currently logged in.
   *
   * @returns {boolean} True if the user is logged in; otherwise, false.
   */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  /**
   * Retrieves the authentication token from localStorage.
   *
   * @returns {(string | null)} The authentication token or null if not found.
   */
  getToken(): string | null {
    return localStorage.getItem('cs2_token');
  }

  /**
   * Stores the authentication token in localStorage and updates the token subject.
   *
   * @private
   * @param {string} token - The authentication token to set.
   * @returns {void}
   */
  private setToken(token: string): void {
    localStorage.setItem('cs2_token', token);
    this.tokenSubject.next(token);
  }
}