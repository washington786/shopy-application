import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class CartService {
  private http = inject(HttpClient);
  private authUrl = `${environment.apiUrl}/cart/`;

  addToCart() { }

  loadCartItems() { }

  updateCartItems() { }

  removeCartItem() { }

  clearCart() { }
}
