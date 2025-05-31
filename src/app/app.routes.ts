/**
 * @file app.routes.ts
 * @description Contains the routing configuration for the Angular application.
 */

import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './guards/auth.guard';

/**
 * Array of route configurations for the application.
 *
 * @constant {Routes}
 */
export const routes: Routes = [
  /**
   * Default route.
   * Redirects to '/collections' using full path match.
   */
  { 
    path: '', 
    redirectTo: '/collections', 
    pathMatch: 'full' 
  },

  /**
   * Login route.
   * Loads the LoginComponent lazily.
   * Accessible only when not authenticated.
   *
   * @see guestGuard
   */
  { 
    path: 'login', 
    loadComponent: () => import('./pages/auth/login.componemt').then(m => m.LoginComponent),
    canActivate: [guestGuard]
  },
  
  /**
   * Register route.
   * Loads the RegisterComponent lazily.
   * Accessible only when not authenticated.
   *
   * @see guestGuard
   */
  { 
    path: 'register', 
    loadComponent: () => import('./pages/auth/register.componemt').then(m => m.RegisterComponent),
    canActivate: [guestGuard]
  },

  /**
   * Collections route.
   * Loads the CollectionsComponent lazily.
   * Accessible only when authenticated.
   *
   * @see authGuard
   */
  { 
    path: 'collections', 
    loadComponent: () => import('./pages/collections/collections.component').then(m => m.CollectionsComponent),
    canActivate: [authGuard]
  },
  
  /**
   * Market route.
   * Loads the MarketComponent lazily.
   * Accessible only when authenticated.
   *
   * @see authGuard
   */
  { 
    path: 'market', 
    loadComponent: () => import('./pages/market/market.component').then(m => m.MarketComponent),
    canActivate: [authGuard]
  },
  
  /**
   * Stickers route.
   * Loads the StickersComponent lazily.
   * Accessible only when authenticated.
   *
   * @see authGuard
   */
  { 
    path: 'stickers', 
    loadComponent: () => import('./pages/stickers/stickers.component').then(m => m.StickersComponent),
    canActivate: [authGuard]
  },
  
  /**
   * Account route.
   * Loads the AccountComponent lazily.
   * Accessible only when authenticated.
   *
   * @see authGuard
   */
  { 
    path: 'account', 
    loadComponent: () => import('./pages/account/account.component').then(m => m.AccountComponent),
    canActivate: [authGuard]
  },

  /**
   * Wildcard route.
   * Redirects any unmatched URLs to '/login'.
   */
  { 
    path: '**', 
    redirectTo: '/login' 
  }
];