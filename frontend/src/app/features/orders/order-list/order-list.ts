import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingSpinner } from "../../../shared/loading-spinner/loading-spinner";
import { MatIconModule } from '@angular/material/icon'
import { DatePipe } from '@angular/common';
import { OrderService } from '../../../core/services/order-service';
import { OrderDto } from '../../../core/models/order.model';

@Component({
  selector: 'app-order-list',
  imports: [LoadingSpinner, MatIconModule, DatePipe],
  templateUrl: './order-list.html',
  styleUrl: './order-list.css'
})
export class OrderList implements OnInit {
  service = inject(OrderService);
  destroyRef = inject(DestroyRef);
  orders = signal<OrderDto[] | null>(null);

  router = inject(Router);
  // UI State
  isLoading = signal<boolean>(false);
  selectedStatus: string | null = null;
  error: string | null = null;

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.isLoading.set(true);
    let sub = this.service.getAllOrders().subscribe({
      next: response => {
        this.orders.set(response);
        this.isLoading.set(false);
      },
      error: error => {
        this.error = error;
        this.isLoading.set(false);
      }
    });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  get filteredOrders() {
    const items = this.orders();
    if (!items || items.length === 0) return [];
    return this.selectedStatus ?
      items.filter(order => order.status === this.selectedStatus) :
      items;
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
