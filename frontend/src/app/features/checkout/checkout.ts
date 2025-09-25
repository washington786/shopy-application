import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingSpinner } from "../../shared/loading-spinner/loading-spinner";
import { NgFor, NgIf } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-checkout',
  imports: [LoadingSpinner, NgFor, NgIf, FormsModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class Checkout implements OnInit {
  cartSummary = {
    items: [
      { name: 'Wireless Headphones', quantity: 1, price: 99.99 },
      { name: 'Cotton T-Shirt', quantity: 2, price: 19.99 }
    ],
    subtotal: 139.97,
    shipping: 0.00,
    tax: 12.60,
    total: 152.57
  };

  // Checkout form
  checkoutForm: FormGroup;
  isLoading = false;
  paymentMethod = 'card';

  constructor(private fb: FormBuilder, private router: Router) {
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

  ngOnInit() {
    this.isLoading = true;
    // Simulate API delay
    setTimeout(() => {
      this.isLoading = false;
    }, 800);
  }

  onSubmit() {
    if (this.checkoutForm.invalid) {
      this.markFormGroupTouched(this.checkoutForm);
      return;
    }

    this.isLoading = true;
    // TODO: Connect to CheckoutService later
    console.log('Checkout form submitted', {
      ...this.checkoutForm.value,
      paymentMethod: this.paymentMethod,
      cartSummary: this.cartSummary
    });

    // Simulate API delay
    setTimeout(() => {
      this.isLoading = false;
      // Redirect to success page
      this.router.navigate(['/app/checkout-success'], {
        queryParams: { orderId: 'ORD-2024-001' }
      });
      // Simulate error
      // alert('Payment failed. Please try again.');
    }, 1500);
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
