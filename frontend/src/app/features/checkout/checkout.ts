import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingSpinner } from "../../shared/loading-spinner/loading-spinner";
import { CurrencyPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../core/services/cart-service';
import { CartItemDto } from '../../core/models/cart.model';

import { loadStripe, Stripe } from '@stripe/stripe-js';
import { CheckoutService } from '../../core/services/checkout-service';

interface CartSummaryItem {
  name: string;
  quantity: number;
  price: number;
}

interface CartSummary {
  items: CartSummaryItem[];
  subTotal: number;
  shipping: number;
  tax: number;
  total: number;
}

const stripePromise = loadStripe('');

@Component({
  selector: 'app-checkout',
  imports: [LoadingSpinner, FormsModule, ReactiveFormsModule, MatIconModule, CurrencyPipe],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class Checkout implements OnInit {
  // stripe
  private stripe: Stripe | null = null;

  paymentService = inject(CheckoutService);

  cartItems = signal<CartItemDto[] | null>(null);

  service = inject(CartService);
  destroyRef = inject(DestroyRef);
  router = inject(Router);

  // Checkout form
  checkoutForm: FormGroup;
  isLoading = signal<boolean>(false);
  paymentMethod = 'card';
  error = signal<string | null>(null);

  hideForm = signal(true);

  cartSummary = computed<CartSummary | null>(() => {
    const items = this.cartItems();
    if (!items || items.length === 0) return null;

    const summaryItems: CartSummaryItem[] = items.map(item => ({
      name: item.productName,
      quantity: item.quantity,
      price: item.productPrice
    }));

    const subTotal = items.reduce((sum, item) => sum + (item.quantity * item.productPrice), 0);
    const shipping = 5.99;
    const tax = subTotal * 0.08;
    const total = subTotal + shipping + tax;

    return {
      items: summaryItems,
      subTotal,
      shipping,
      tax,
      total
    };
  });

  constructor(private fb: FormBuilder) {
    this.checkoutForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', [Validators.required, Validators.pattern(/^\d{5}(-\d{4})?$/)]],
      country: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\+?1?-?\d{3}-?\d{3}-?\d{4}$/)]],
      saveAddress: [false]
    });
  }

  async ngOnInit() {
    this.stripe = await stripePromise;
    this.setupStripeCard();
    this.hideForm.set(true)
    this.loadCartItems();
  }

  async setupStripeCard() {
    if (!this.stripe) return;

    const elements = this.stripe.elements();

    const card = elements.create('card', {
      style: {
        base: {
          fontSize: '16px',
          color: '#424770',
          '::placeholder': { color: '#aab7c4' }
        }
      }
    });

    card.mount('#card-element');

    card.on('change', (event) => {
      if (event.error) {
        this.error.set(event.error.message || 'Invalid card');
      } else {
        this.error.set(null);
      }
    });
  }

  loadCartItems() {
    this.isLoading.set(true);
    const sub = this.service.loadCartItems().subscribe({
      next: cartItems => {
        this.isLoading.set(false);
        this.cartItems.set(cartItems);
        if (cartItems.length === 0) {
          this.router.navigate(['/app/products']);
        }
      },
      error: error => {
        this.isLoading.set(false);
        this.error.set(error);
        this.router.navigate(['/app/cart']);
      }
    });

    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  onSubmit() {
    if (!this.stripe) return;
    this.isLoading.set(true);
    const sub = this.paymentService.CreatePayment().subscribe({});
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  goBack() {
    this.router.navigate(['/app/cart']);
  }
}
