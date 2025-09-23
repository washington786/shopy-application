import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingSpinner } from "../../../shared/loading-spinner/loading-spinner";
import { DatePipe, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-order-detail',
  imports: [LoadingSpinner, NgFor, NgIf, DatePipe],
  templateUrl: './order-detail.html',
  styleUrl: './order-detail.css'
})
export class OrderDetail implements OnInit {
  order = {
    id: 1,
    orderNumber: 'ORD-2024-001',
    totalAmount: 259.97,
    status: 'Delivered',
    orderDate: '2024-06-15T10:30:00Z',
    items: [
      {
        productId: 1,
        productName: 'Wireless Headphones',
        productImageUrl: '/assets/images/headphones.jpg',
        quantity: 1,
        unitPrice: 99.99,
        totalPrice: 99.99
      },
      {
        productId: 3,
        productName: 'Cotton T-Shirt',
        productImageUrl: '/assets/images/tshirt.jpg',
        quantity: 3,
        unitPrice: 19.99,
        totalPrice: 59.97
      },
      {
        productId: 4,
        productName: 'Coffee Maker',
        productImageUrl: '/assets/images/coffee-maker.jpg',
        quantity: 1,
        unitPrice: 99.99,
        totalPrice: 99.99
      }
    ],
    shippingAddress: {
      fullName: 'John Doe',
      addressLine1: '123 Main Street',
      addressLine2: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'USA',
      phone: '+1 (555) 123-4567'
    },
    payment: {
      provider: 'Stripe',
      status: 'Succeeded',
      transactionId: 'txn_123456789',
      amount: 259.97
    }
  };

  // UI State
  isLoading = false;
  route = inject(ActivatedRoute);
  router = inject(Router);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    // In real app, we'd load order by ID
    // For now, we use mock data
    console.log('Loading order with ID:', id);

    this.isLoading = true;
    // Simulate API delay
    setTimeout(() => {
      this.isLoading = false;
    }, 800);
  }

  goToOrders() {
    this.router.navigate(['/app/orders']);
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Shipped': return 'bg-blue-100 text-blue-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      case 'Succeeded': return 'bg-green-100 text-green-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}
