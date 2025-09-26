import { inject, Injectable } from '@angular/core';
import { ApiService } from './api-service';
import { AddToCartRequest, CartItemDto, UpdateCartRequest } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})

export class CartService {
  private apiService = inject(ApiService);
  private url = `cart`;

  addToCart(request: AddToCartRequest) {
    return this.apiService.post<CartItemDto>(`${this.url}/add-to-cart`, request);
  }

  loadCartItems() {
    return this.apiService.get<CartItemDto[]>(`/${this.url}/my-cart-items`);
  }

  updateCartItems(id: number, request: UpdateCartRequest) {
    return this.apiService.put<CartItemDto>(`${this.url}/${id}`, request);
  }

  removeCartItem(id: number) {
    return this.apiService.delete<void>(`${this.url}/${id}`);
  }

  clearCart() {
    return this.apiService.delete<void>(`${this.url}/clear-cart`);
  }
}
