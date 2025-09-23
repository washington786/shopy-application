import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingSpinner } from "../../../shared/loading-spinner/loading-spinner";
import { MatIconModule } from '@angular/material/icon'
import { DatePipe, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-order-list',
  imports: [LoadingSpinner, MatIconModule, NgFor, NgIf, DatePipe],
  templateUrl: './order-list.html',
  styleUrl: './order-list.css'
})
export class OrderList implements OnInit {
  orders = [
    {
      id: 1,
      orderNumber: 'ORD-2024-001',
      totalAmount: 259.97,
      status: 'Delivered',
      orderDate: '2024-06-15T10:30:00Z',
      items: [
        { productName: 'Wireless Headphones', quantity: 1, unitPrice: 99.99, totalPrice: 99.99 },
        { productName: 'Cotton T-Shirt', quantity: 3, unitPrice: 19.99, totalPrice: 59.97 },
        { productName: 'Coffee Maker', quantity: 1, unitPrice: 99.99, totalPrice: 99.99 }
      ]
    },
    {
      id: 2,
      orderNumber: 'ORD-2024-002',
      totalAmount: 105.49,
      status: 'Shipped',
      orderDate: '2024-06-20T14:15:00Z',
      items: [
        { productName: 'Bluetooth Speaker', quantity: 1, unitPrice: 59.99, totalPrice: 59.99 },
        { productName: 'Python Programming', quantity: 1, unitPrice: 39.99, totalPrice: 39.99 },
        { productName: 'C# in Depth', quantity: 1, unitPrice: 45.5, totalPrice: 45.5 }
      ]
    },
    {
      id: 3,
      orderNumber: 'ORD-2024-003',
      totalAmount: 19.99,
      status: 'Processing',
      orderDate: '2024-06-25T09:45:00Z',
      items: [
        { productName: 'Cotton T-Shirt', quantity: 1, unitPrice: 19.99, totalPrice: 19.99 }
      ]
    }
  ];

  router = inject(Router);
  // UI State
  isLoading = false;
  selectedStatus: string | null = null;

  ngOnInit() {
    this.isLoading = true;
    // Simulate API delay
    setTimeout(() => {
      this.isLoading = false;
    }, 800);
  }

  get filteredOrders() {
    return this.selectedStatus ?
      this.orders.filter(order => order.status === this.selectedStatus) :
      this.orders;
  }

  viewOrder(id: number) {
    this.router.navigate(['/app/order-detail', id]);
  }

  filterByStatus(status: string | null) {
    this.selectedStatus = status;
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Shipped': return 'bg-blue-100 text-blue-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}
