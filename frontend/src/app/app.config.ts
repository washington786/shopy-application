import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore } from '@ngrx/router-store';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { jwtAuthInterceptor } from './core/interceptor/jwt-auth-interceptor';
import { errorHandlerInterceptor } from './core/interceptor/error-handler-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideStore(),
    provideEffects(),
    provideRouterStore(),
    provideHttpClient(withInterceptors([jwtAuthInterceptor, errorHandlerInterceptor]))
  ]
};
