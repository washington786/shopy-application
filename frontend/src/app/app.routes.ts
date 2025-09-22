import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { authGuard } from './core/guards/auth-guard';
import { Profile } from './features/auth/profile/profile';

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
  }
];
