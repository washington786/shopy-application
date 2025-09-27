import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';

export const routes: Routes = [
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login').then(res => res.Login)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register').then(res => res.Register)
      }
    ]
  },
  {
    pathMatch: "full",
    path: '',
    redirectTo: 'auth/login'
  },
  {
    path: 'app',
    canActivate: [authGuard],
    data: { expectedRoles: ["User", "Admin", "StoreManager"] },
    children: [
      { path: '', pathMatch: 'full', redirectTo: "products" },
      {
        path: 'products',
        loadComponent: () => import('./features/products/products-list/products-list').then(res => res.ProductsList)
      },
      {
        path: 'product-detail/:id',
        loadComponent: () => import('./features/products/products-details/products-details').then(res => res.ProductsDetails)
      },
      {
        path: 'cart',
        loadComponent: () => import("./features/cart/cart").then(res => res.Cart)
      },
      {
        path: 'orders',
        loadComponent: () => import("./features/orders/order-list/order-list").then(res => res.OrderList)
      },
      {
        path: 'order-detail/:id',
        loadComponent: () => import("./features/orders/order-detail/order-detail").then(res => res.OrderDetail)
      },
      {
        path: 'checkout',
        loadComponent: () => import("./features/checkout/checkout").then(res => res.Checkout)
      },
      {
        path: 'checkout-success',
        loadComponent: () => import("./features/checkout/checkout-success/checkout-success").then(res => res.CheckoutSuccess)
      },
      {
        path: 'success',
        redirectTo: "checkout-success"
      },
      {
        path: 'profile',
        loadComponent: () => import("./features/auth/profile/profile").then(res => res.Profile),
      },
    ],
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { expectedRoles: ["Admin", "StoreManager"] },
    children: [
      { path: '', pathMatch: "full", redirectTo: "products" },
      { path: "products", loadComponent: () => import('./features/admin/product-management/product-management').then(res => res.ProductManagement) },
      { path: "users", loadComponent: () => import("./features/admin/user-management/user-management").then(res => res.UserManagement) },
      { path: "categories", loadComponent: () => import("./features/admin/categories-management/categories-management").then(res => res.CategoriesManagement) },
    ],
  },
  {
    path: "**",
    redirectTo: "/auth/login"
  }
];
