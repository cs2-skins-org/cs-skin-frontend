// src/app/services/balance.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Service for handling balance state management.
 *
 * @class BalanceService
 */
@Injectable({
  providedIn: 'root'
})
export class BalanceService {
  /**
   * Subject emitting balance updates.
   * @private
   */
  private balanceSubject = new BehaviorSubject<number>(0);

  /**
   * Observable stream of balance updates.
   */
  public balance$ = this.balanceSubject.asObservable();

  /**
   * Updates the balance with a new value.
   *
   * @param {number} newBalance - The new balance to set.
   * @returns {void}
   */
  updateBalance(newBalance: number): void {
    console.log('BalanceService: Updating balance to', newBalance);
    this.balanceSubject.next(newBalance);
  }

  /**
   * Retrieves the current balance.
   *
   * @returns {number} The current balance.
   */
  getCurrentBalance(): number {
    return this.balanceSubject.value;
  }

  /**
   * Resets the balance to zero, typically used during logout.
   *
   * @returns {void}
   */
  resetBalance(): void {
    this.balanceSubject.next(0);
  }
}