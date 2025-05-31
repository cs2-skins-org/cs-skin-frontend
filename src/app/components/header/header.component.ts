import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { BalanceService } from '../../services/balance.service';
import { Subscription } from 'rxjs';

/**
 * Header component for the application.
 *
 * @component
 * @implements {OnInit, OnDestroy}
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  /**
   * Instance of UserService for user operations.
   * @private
   */
  private userService = inject(UserService);
  /**
   * Instance of AuthService for authentication operations.
   * @private
   */
  private authService = inject(AuthService);
  /**
   * Instance of BalanceService for managing user balance.
   * @private
   */
  private balanceService = inject(BalanceService);
  /**
   * Instance of Router for navigation.
   * @private
   */
  private router = inject(Router);
  
  /**
   * Current user balance.
   */
  userBalance: number | null = null;
  /**
   * Indicates whether the user is logged in.
   */
  isLoggedIn: boolean = false;
  /**
   * Subscription for authentication changes.
   * @private
   */
  private authSubscription?: Subscription;
  /**
   * Subscription for balance updates.
   * @private
   */
  private balanceSubscription?: Subscription;

  /**
   * Lifecycle hook called after component initialization.
   *
   * @returns {void}
   */
  ngOnInit(): void {
    // Check initial authentication state.
    this.checkAuthState();
    
    // Subscribe to authentication token changes.
    this.authSubscription = this.authService.token$.subscribe(() => {
      this.checkAuthState();
    });

    // Subscribe to balance updates.
    this.balanceSubscription = this.balanceService.balance$.subscribe(balance => {
      if (this.isLoggedIn && balance > 0) {
        this.userBalance = balance;
      }
    });
  }

  /**
   * Lifecycle hook called when the component is destroyed.
   *
   * @returns {void}
   */
  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.balanceSubscription) {
      this.balanceSubscription.unsubscribe();
    }
  }

  /**
   * Checks the authentication state of the user.
   * Sets the isLoggedIn flag and loads user balance if authenticated.
   *
   * @private
   * @returns {void}
   */
  private checkAuthState(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    
    if (this.isLoggedIn) {
      this.loadUserBalance();
    } else {
      this.userBalance = null;
    }
  }

  /**
   * Loads the user's balance from the server and updates the balance service.
   *
   * @async
   * @returns {Promise<void>} A promise that resolves when the balance is loaded.
   */
  async loadUserBalance(): Promise<void> {
    try {
      const balanceData = await this.userService.getBalance();
      this.userBalance = balanceData.balance;
      // Update balance service
      this.balanceService.updateBalance(balanceData.balance);
    } catch (error: any) {
      console.error('Error loading user balance:', error);
      // If there's an authentication error, user might need to login again.
      if (error?.status === 401) {
        this.authService.logout();
        this.router.navigate(['/login']);
      }
    }
  }

  /**
   * Logs out the current user and redirects to the login page.
   *
   * @returns {void}
   */
  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}