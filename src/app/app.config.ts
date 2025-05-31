/**
 * @file app.config.ts
 * @description Configuration file for the Angular application.
 */

import { ApplicationConfig } from "@angular/core";
import { provideRouter } from "@angular/router";
import { provideHttpClient } from "@angular/common/http";
import { routes } from "./app.routes";

/**
 * Application configuration object.
 * 
 * This configuration provides:
 * - Routing configuration via provideRouter.
 * - HTTP client functionality via provideHttpClient.
 *
 * @constant {ApplicationConfig}
 */
export const appConfig: ApplicationConfig = {
  providers: [
    /**
     * Provides router configuration using the routes defined in app.routes.ts.
     */
    provideRouter(routes),
    /**
     * Provides HTTP client functionality.
     */
    provideHttpClient()
  ],
};