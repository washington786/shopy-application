import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon'
import { CartBadgeComponent } from "../cart-badge-component/cart-badge-component";
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../core/services/auth-service';
import { MatButtonModule } from '@angular/material/button'
import { UserDto } from '../../core/models/auth.model';

@Component({
  selector: 'app-header-component',
  imports: [MatIconModule, CartBadgeComponent, MatMenuModule, RouterLink, MatButtonModule],
  templateUrl: './header-component.html',
  styleUrl: './header-component.css'
})

export class HeaderComponent implements OnInit {
  // store = inject(Store);
  router = inject(Router);
  service = inject(AuthService);
  user = signal<UserDto | null>(null);
  isAuthenticated$ = signal<boolean>(false);
  destroyRef = inject(DestroyRef);
  // cartCount$ = this.store.select(selectCartCount);
  // user$ = this.store.select(selectAuthUser);

  hasAdminRole = computed(() => {
    const user = this.user();
    return user?.roles?.some(role =>
      role === "Admin" || role === "StoreManager"
    ) ?? false;
  });

  hasUserRole = computed(() => {
    const user = this.user();
    return user?.roles?.includes("User") ?? false;
  });

  // Determine which route to use based on primary role
  isAdminRoute = computed(() => {
    return this.hasAdminRole() && !this.hasUserRole();
  });

  isUserRoute = computed(() => {
    return this.hasUserRole() && !this.hasAdminRole();
  });

  // For users with both roles, you might want to prioritize one
  primaryRoute = computed(() => {
    if (this.hasAdminRole()) return '/admin/products';
    if (this.hasUserRole()) return '/app/products';
    return '/auth/login';
  });

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

  goToAdminProfile() {
    this.router.navigate(['/admin/products'])
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile() {
    let sub = this.service.getUserProfile().subscribe({
      next: res => {
        this.user.set(res);
        this.isAuthenticated$.set(true);
      }, error: error => {
        console.log('Header: ', error)
        this.isAuthenticated$.set(false);
      }
    });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }
}
