import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon'
import { CartBadgeComponent } from "../cart-badge-component/cart-badge-component";
import { AsyncPipe } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../core/services/auth-service';
import { MatButtonModule } from '@angular/material/button'
import { UserDto } from '../../core/models/auth.model';

@Component({
  selector: 'app-header-component',
  imports: [MatIconModule, CartBadgeComponent, AsyncPipe, MatMenuModule, RouterLink, MatButtonModule],
  templateUrl: './header-component.html',
  styleUrl: './header-component.css'
})

export class HeaderComponent implements OnInit {
  // store = inject(Store);
  router = inject(Router);
  service = inject(AuthService);
  user$: UserDto | null = null;
  isAuthenticated$: boolean = false;
  destroyRef = inject(DestroyRef);
  // cartCount$ = this.store.select(selectCartCount);
  // user$ = this.store.select(selectAuthUser);

  logout() {
    this.service.logout();
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
    let sub = this.service.getUserProfile().subscribe({
      next: res => {
        this.user$ = res;
        this.isAuthenticated$ = true;
      }
    });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }
}
