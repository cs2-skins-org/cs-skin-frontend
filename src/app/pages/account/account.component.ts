import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { BalanceService } from '../../services/balance.service';

/**
 * Interface representing the current user's information.
 *
 * @interface
 */
interface CurrentUser {
  /** Unique identifier for the user. */
  id: number;
  /** Username of the user. */
  username: string;
  /** Email address of the user. */
  email: string;
  /** Account creation date. */
  created_at: Date;
}

/**
 * AccountComponent displays user account details, including balance and profile info,
 * and provides logout functionality.
 *
 * @component
 * @implements {OnInit}
 */
@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent implements OnInit {
  /**
   * Authentication service for managing user authentication.
   * @private
   */
  private authService = inject(AuthService);

  /**
   * Service for retrieving user-related data.
   * @private
   */
  private userService = inject(UserService);

  /**
   * Service for updating and retrieving user balance.
   * @private
   */
  private balanceService = inject(BalanceService);

  /**
   * Router service for navigation.
   * @private
   */
  private router = inject(Router);

  /**
   * Holds the current user's details.
   * @type {CurrentUser | null}
   */
  currentUser: CurrentUser | null = null;

  /**
   * Holds the current user's balance.
   * @type {number}
   */
  userBalance: number = 0;

  /**
   * Indicates whether account data is currently loading.
   * @type {boolean}
   */
  loading = true;

  /**
   * Lifecycle hook called after data-bound properties are initialized.
   * Initiates loading of the account data.
   *
   * @returns {void}
   */
  ngOnInit(): void {
    this.loadAccountData();
  }

  /**
   * Loads account data including the user's balance and profile information.
   * Updates the balance service with the new balance.
   *
   * @async
   * @returns {Promise<void>}
   */
  async loadAccountData(): Promise<void> {
    try {
      const [balanceData, userInfo] = await Promise.all([
        this.userService.getBalance(),
        this.getCurrentUserInfo()
      ]);

      this.userBalance = balanceData.balance;
      this.currentUser = userInfo;
      this.balanceService.updateBalance(balanceData.balance);
      this.loading = false;
    } catch (error) {
      console.error('Error loading account data:', error);
      this.loading = false;
    }
  }

  /**
   * Retrieves the current user's information.
   * First attempts to fetch from the balance response, then falls back to decoding the JWT token.
   *
   * @async
   * @returns {Promise<CurrentUser>} A promise that resolves to the user's information.
   */
  private async getCurrentUserInfo(): Promise<CurrentUser> {
    try {
      // Attempt to get user info from balanceResponse if available.
      const balanceData = await this.userService.getBalance();
      // Uncomment and adjust as needed if backend provides user details with balance.
      // if (balanceData.userId) {
      //   try {
      //     const userDetails = await this.userService.getUserById(balanceData.userId).toPromise();
      //     return {
      //       id: userDetails.id,
      //       username: userDetails.username,
      //       email: userDetails.email,
      //       created_at: userDetails.created_at
      //     };
      //   } catch (error) {
      //     console.log('Could not get user details, using token data');
      //   }
      // }

      // Fallback: Extract user info from JWT token.
      return this.getUserInfoFromToken();
    } catch (error) {
      console.error('Error getting user info:', error);
      return this.getUserInfoFromToken();
    }
  }

  /**
   * Extracts user information from the JWT token.
   *
   * @private
   * @returns {CurrentUser} The user information extracted from the token.
   */
  private getUserInfoFromToken(): CurrentUser {
    const token = this.authService.getToken();
    if (token) {
      try {
        // Decode the JWT token (basic decode; ensure proper validation in production)
        const payload = JSON.parse(atob(token.split('.')[1]));
        return {
          id: payload.sub || 0,
          username: payload.username || 'User',
          email: payload.email || 'user@example.com',
          created_at: new Date()
        };
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
    // Ultimate fallback if token conversion fails.
    return {
      id: 0,
      username: 'User',
      email: 'user@example.com',
      created_at: new Date()
    };
  }

  /**
   * Logs out the current user and navigates to the login page.
   *
   * @returns {void}
   */
  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  /**
   * Gets the user's initials based on the username.
   *
   * @returns {string} The first two characters of the username in uppercase; returns 'U' if username is not set.
   */
  getUserInitials(): string {
    if (this.currentUser?.username) {
      return this.currentUser.username.substring(0, 2).toUpperCase();
    }
    return 'U';
  }

  /**
   * Formats a date into a human-readable string.
   *
   * @param {Date | undefined} date - The date to format.
   * @returns {string} A formatted date string or 'Unknown' if no date is provided.
   */
  formatDate(date: Date | undefined): string {
    if (!date) return 'Unknown';
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  }
}