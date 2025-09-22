import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectCartCount } from '../../store/selectors/cart-selector';
import { selectAuthUser, selectIsAuthenticated } from '../../store/selectors/auth-selector';
import { logoutAction } from '../../store/actions/auth-actions';
import { MatIconModule } from '@angular/material/icon'
import { CartBadgeComponent } from "../cart-badge-component/cart-badge-component";
import { AsyncPipe } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-header-component',
  imports: [MatIconModule, CartBadgeComponent, AsyncPipe, MatMenuModule],
  templateUrl: './header-component.html',
  styleUrl: './header-component.css'
})

export class HeaderComponent {
  store = inject(Store);
  router = inject(Router);

  cartCount$ = this.store.select(selectCartCount);
  isAuthenticated$ = this.store.select(selectIsAuthenticated);
  user$ = this.store.select(selectAuthUser);

  logout() {
    this.store.dispatch(logoutAction());
  }

  goToCart() {
    this.router.navigate(["/cart"]);
  }

  goToProfile() {
    this.router.navigate(["/profile"]);
  }

  goToLogin() {
    this.router.navigate(["/auth/login"]);
  }
}
