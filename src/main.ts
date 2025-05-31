/**
 * @file main.ts
 * @description Entry point of the Angular application.
 */

import { bootstrapApplication } from "@angular/platform-browser";
import { provideRouter } from "@angular/router";
import {
  provideHttpClient,
  withInterceptorsFromDi,
  HTTP_INTERCEPTORS,
} from "@angular/common/http";
import { importProvidersFrom } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from "./app/app.component";
import { routes } from "./app/app.routes";
import { JwtInterceptor } from "./app/interceptors/jwt.interceptor";

/**
 * Bootstraps the Angular application with the main AppComponent and the required providers.
 * 
 * Providers include:
 * - Router configuration via provideRouter.
 * - HTTP client support with interceptors via provideHttpClient.
 * - JWT interceptor for HTTP calls.
 * - Reactive forms support via importProvidersFrom.
 */
bootstrapApplication(AppComponent, {
  providers: [
    /**
     * Provides routing configuration for the application.
     */
    provideRouter(routes),
    /**
     * Provides HTTP client functionality with DI-based interceptors support.
     */
    provideHttpClient(withInterceptorsFromDi()),
    /**
     * Registers the JWT interceptor for HTTP requests.
     */
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    /**
     * Imports providers necessary for the ReactiveFormsModule.
     */
    importProvidersFrom(ReactiveFormsModule),
  ],
}).catch((err: any) => {
  /**
   * Handles errors thrown during application bootstrap.
   *
   * @param {any} err - The error encountered while bootstrapping the application.
   */
  console.error(err);
});