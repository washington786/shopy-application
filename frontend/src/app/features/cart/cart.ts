import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingSpinner } from "../../shared/loading-spinner/loading-spinner";

import { MatIconModule } from '@angular/material/icon';
import { CartItemDto } from '../../core/models/cart.model';
import { CartService } from '../../core/services/cart-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [LoadingSpinner, MatIconModule, CurrencyPipe],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart implements OnInit {

  allCartItems = signal<CartItemDto[] | null>([]);

  destroyRef = inject(DestroyRef);

  service = inject(CartService);

  // UI State
  isLoading = signal(false);

  router = inject(Router)

  error = signal<string | null>(null);

  snackBar = inject(MatSnackBar);

  cartItemsSummary = computed(() => {
    const items: CartItemDto[] = this.allCartItems()!;
    if (!items || items.length === 0) return null;
    const totalPrice = items.reduce((acc, item) => acc + (item.productPrice * item.quantity), 0)
    const cartCount = items.reduce((count, item) => count + item.quantity, 0);
    return {
      totalPrice,
      cartCount
    }
  })

  ngOnInit() {
    this.loadCartItems();
  }

  loadCartItems() {
    this.isLoading.set(true);
    const sub = this.service.loadCartItems().subscribe({
      next: cartItems => {
        console.log(cartItems);
        this.isLoading.set(false);
        this.allCartItems.set(cartItems);
      },
      error: error => {
        this.isLoading.set(false);
        this.error.set(error);
      }
    });

    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  updateQty = (id: number, qty: number) => computed(() => this.updateQuantity(id, Math.max(1, qty - 1)));

  updateQuantity(id: number, newQuantity: number) {
    if (newQuantity < 1) return;

    const cartItems = this.allCartItems();

    const item = cartItems?.find(item => item.id === id);
    if (item) {
      item.quantity = newQuantity;
      item.totalPrice = item.productPrice * newQuantity;
    }

    const sub = this.service.updateCartItems(item?.id!, { quantity: newQuantity }).subscribe({
      next: res => {
        if (!res) return;
        this.loadCartItems();
      },
      error: error => {
        this.error.set(error);
      }
    });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  removeFromCart(id: number) {
    let cartItems = this.allCartItems()!;
    cartItems = cartItems.filter(item => item.id !== id);
    const sub = this.service.removeCartItem(id).subscribe({
      next: () => {
        this.loadCartItems();
        this.snackBar.open("remo", "Ok", { duration: 4000 });
      },
      error: error => {
        console.log(error);
        this.error.set(error);
      }
    });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  clearCart() {
    this.isLoading.set(true);
    const sub = this.service.clearCart().subscribe({
      next: () => {
        this.isLoading.set(false);
        this.snackBar.open("Cart cleared successfully", "Ok", { duration: 4000 });
        this.loadCartItems();
      },
      error: (error) => {
        console.log(error);

        this.isLoading.set(false);
        this.snackBar.open("Failed to clear cart items.", "Ok", { duration: 4000 });
      }
    });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  proceedToCheckout() {
    const cartItems = this.allCartItems();

    if (cartItems?.length === 0) return;

    this.router.navigate(['/app/checkout']);
  }

  continueShopping() {
    this.router.navigate(['/app/products']);
  }
}
