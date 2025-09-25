import { Component, computed, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingSpinner } from "../../shared/loading-spinner/loading-spinner";
import { NgFor, NgIf } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-cart',
  imports: [LoadingSpinner, NgIf, MatIconModule, NgFor],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart implements OnInit {
  cartItems = [
    {
      id: 1,
      productId: 1,
      productName: 'Wireless Headphones',
      productImageUrl: '/assets/images/headphones.jpg',
      productPrice: 99.99,
      quantity: 2,
      totalPrice: 199.98
    },
    {
      id: 2,
      productId: 3,
      productName: 'Cotton T-Shirt',
      productImageUrl: '/assets/images/tshirt.jpg',
      productPrice: 19.99,
      quantity: 3,
      totalPrice: 59.97
    },
    {
      id: 3,
      productId: 4,
      productName: 'Coffee Maker',
      productImageUrl: '/assets/images/coffee-maker.jpg',
      productPrice: 79.99,
      quantity: 1,
      totalPrice: 79.99
    }
  ];

  // UI State
  isLoading = false;

  router = inject(Router)

  ngOnInit() {
    this.isLoading = true;
    // Simulate API delay
    setTimeout(() => {
      this.isLoading = false;
    }, 800);
  }

  get cartTotal(): number {
    return this.cartItems.reduce((total, item) => total + item.totalPrice, 0);
  }

  get cartCount(): number {
    return this.cartItems.reduce((count, item) => count + item.quantity, 0);
  }

  updateQty = (id: number, qty: number) => computed(() => this.updateQuantity(id, Math.max(1, qty - 1)));

  updateQuantity(id: number, newQuantity: number) {
    if (newQuantity < 1) return;

    const item = this.cartItems.find(item => item.id === id);
    if (item) {
      item.quantity = newQuantity;
      item.totalPrice = item.productPrice * newQuantity;
    }

    // TODO: Connect to CartService later
    console.log('Update quantity', id, newQuantity);
  }

  removeFromCart(id: number) {
    // TODO: Connect to CartService later
    console.log('Remove from cart', id);
    this.cartItems = this.cartItems.filter(item => item.id !== id);
  }

  clearCart() {
    // TODO: Connect to CartService later
    console.log('Clear cart');
    this.cartItems = [];
  }

  proceedToCheckout() {
    if (this.cartItems.length === 0) return;

    this.router.navigate(['/app/checkout']);
  }

  continueShopping() {
    this.router.navigate(['/app/products']);
  }
}
