import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectCartCount } from '../../store/selectors/cart-selector';
import { selectAuthUser, selectIsAuthenticated } from '../../store/selectors/auth-selector';
import { logoutAction } from '../../store/actions/auth-actions';
import { MatIconModule } from '@angular/material/icon'
import { CartBadgeComponent } from "../cart-badge-component/cart-badge-component";
import { AsyncPipe } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../core/services/auth-service';
import { MatButtonModule } from '@angular/material/button'

@Component({
  selector: 'app-header-component',
  imports: [MatIconModule, CartBadgeComponent, AsyncPipe, MatMenuModule, RouterLink, MatButtonModule],
  templateUrl: './header-component.html',
  styleUrl: './header-component.css'
})

export class HeaderComponent implements OnInit {
  store = inject(Store);
  router = inject(Router);
  service = inject(AuthService);

  cartCount$ = this.store.select(selectCartCount);
  isAuthenticated$ = this.service.isAuthenticated();
  user$ = this.store.select(selectAuthUser);

  logout() {
    this.store.dispatch(logoutAction());
  }

  goToCart() {
    this.router.navigate(["/app/cart"]);
  }

  goToProfile() {
    this.router.navigate(["/app/profile"]);
  }

  goToLogin() {
    this.router.navigate(["/auth/login"]);
  }

  ngOnInit(): void {

  }
}
