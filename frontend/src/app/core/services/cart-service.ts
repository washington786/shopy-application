import { inject, Injectable } from '@angular/core';
import { ApiService } from './api-service';

@Injectable({
  providedIn: 'root'
})

export class CartService {
  private apiService = inject(ApiService);
  private authUrl = `/cart/`;

  addToCart() { }

  loadCartItems() { }

  updateCartItems() { }

  removeCartItem() { }

  clearCart() { }
}
