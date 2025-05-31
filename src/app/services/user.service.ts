/**
 * @file user.service.ts
 * @description Contains the UserService class which handles user-related HTTP operations.
 */

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';
import { User, BalanceResponse } from '../models/interfaces';

/**
 * Service for handling user related operations.
 *
 * @class UserService
 * @remarks
 * Available throughout the root injector.
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {
  /**
   * HttpClient instance for making HTTP requests.
   * @private
   */
  private http = inject(HttpClient);

  /**
   * Base API URL for user endpoints.
   * @private
   */
  private apiUrl = 'http://localhost:3000/users';

  /**
   * Retrieves the user's balance.
   *
   * @async
   * @returns {Promise<BalanceResponse>} Promise containing the balance response.
   */
  async getBalance(): Promise<BalanceResponse> {
    return firstValueFrom(
      this.http.get<BalanceResponse>(`${this.apiUrl}/balance`)
    );
  }

  /**
   * Tops up the user's balance.
   *
   * @param {number} amount - The amount to top up.
   * @returns {Observable<any>} An observable of the HTTP response.
   */
  topUpBalance(amount: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/topup`, { amount });
  }

  /**
   * Retrieves all users (admin only).
   *
   * @returns {Observable<User[]>} An observable containing an array of users.
   */
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  /**
   * Retrieves a user by their ID.
   *
   * @param {number} id - The ID of the user.
   * @returns {Observable<User>} An observable containing the user.
   */
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  /**
   * Updates a user's information.
   *
   * @param {number} id - The ID of the user.
   * @param {Partial<User>} user - An object containing the user fields to update.
   * @returns {Observable<User>} An observable containing the updated user.
   */
  updateUser(id: number, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  /**
   * Deletes a user (admin only).
   *
   * @param {number} id - The ID of the user.
   * @returns {Observable<void>} An observable of the deletion result.
   */
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}