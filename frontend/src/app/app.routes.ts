import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { authGuard } from './core/guards/auth-guard';
import { Profile } from './features/auth/profile/profile';
import { ProductsList } from './features/products/products-list/products-list';
import { ProductsDetails } from './features/products/products-details/products-details';
import { Cart } from './features/cart/cart';
import { OrderList } from './features/orders/order-list/order-list';
import { OrderDetail } from './features/orders/order-detail/order-detail';
import { Checkout } from './features/checkout/checkout';
import { CheckoutSuccess } from './features/checkout/checkout-success/checkout-success';
import { ProductManagement } from './features/admin/product-management/product-management';
import { UserManagement } from './features/admin/user-management/user-management';

export const routes: Routes = [
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        component: Login
      },
      {
        path: 'register',
        component: Register
      },
      {
        path: 'profile',
        component: Profile,
        canActivate: [authGuard]
      },
    ]
  },
  {
    pathMatch: "full",
    path: '',
    redirectTo: 'auth/login'
  },
  {
    path: 'app',
    children: [
      {
        path: 'products',
        component: ProductsList
      },
      {
        path: 'product-details',
        component: ProductsDetails
      },
      {
        path: 'cart',
        component: Cart
      },
      {
        path: 'orders',
        component: OrderList
      },
      {
        path: 'order-detail',
        component: OrderDetail
      },
      {
        path: 'checkout',
        component: Checkout
      },
      {
        path: 'checkout-success',
        component: CheckoutSuccess
      },
      {
        path: 'admin',
        children: [
          { path: "product-management", component: ProductManagement },
          { path: "user-management", component: UserManagement },
        ]
      },
    ]
  },
  {
    path: "**",
    redirectTo: "/auth/login"
  }
];
