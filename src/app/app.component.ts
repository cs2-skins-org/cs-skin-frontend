import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { AuthService } from './services/auth.service';

/**
 * Root component for the Angular application.
 *
 * @component
 * @implements {OnInit}
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  /**
   * Instance of AuthService for authentication operations.
   * @private
   */
  private authService = inject(AuthService);

  /**
   * Instance of Router for navigation.
   * @private
   */
  private router = inject(Router);
  
  /**
   * Title of the application.
   */
  title = 'cs2-skin-frontend';

  /**
   * Life cycle hook that is called after data-bound properties are initialized.
   *
   * @returns {void}
   */
  ngOnInit(): void {
    // Handle initial routing based on auth state
    this.handleInitialRouting();
  }

  /**
   * Determines the initial routing based on the user's authentication state and current URL.
   *
   * - If the user is on the root path, navigates to '/collections' when logged in or '/login' when not.
   * - If the user is not logged in and tries to access protected routes, navigates to '/login'.
   * - If the user is logged in and tries to access authentication routes, navigates to '/collections'.
   *
   * @private
   * @returns {void}
   */
  private handleInitialRouting(): void {
    const currentUrl = this.router.url;
    const isLoggedIn = this.authService.isLoggedIn();
    
    // If user is on root path, redirect appropriately
    if (currentUrl === '/') {
      if (isLoggedIn) {
        this.router.navigate(['/collections']);
      } else {
        this.router.navigate(['/login']);
      }
    }
    
    // If user is not logged in and trying to access protected routes
    const protectedRoutes = ['/collections', '/market', '/stickers', '/account'];
    if (!isLoggedIn && protectedRoutes.some(route => currentUrl.startsWith(route))) {
      this.router.navigate(['/login']);
    }
    
    // If user is logged in and trying to access auth routes
    const authRoutes = ['/login', '/register'];
    if (isLoggedIn && authRoutes.some(route => currentUrl.startsWith(route))) {
      this.router.navigate(['/collections']);
    }
  }
}