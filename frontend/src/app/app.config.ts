import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore } from '@ngrx/router-store';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { jwtAuthInterceptor } from './core/interceptor/jwt-auth-interceptor';
import { errorHandlerInterceptor } from './core/interceptor/error-handler-interceptor';
import { AuthEffects } from './store/effects/auth-effects';
import { CartEffects } from './store/effects/cart-effects';
import { OrderEffects } from './store/effects/order-effects';
import { ProductEffects } from './store/effects/product-effects';
import { authReducer } from './store/reducers/auth-reducer';
import { cartReducer } from './store/reducers/cart-reducer';
import { orderReducer } from './store/reducers/order-reducer';
import { productsReducer } from './store/reducers/product-reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideStore({ auth: authReducer, cart: cartReducer, order: orderReducer, product: productsReducer }),
    provideEffects([AuthEffects, CartEffects, OrderEffects, ProductEffects]),
    provideRouterStore(),
    provideHttpClient(withInterceptors([jwtAuthInterceptor, errorHandlerInterceptor]))
  ]
};
