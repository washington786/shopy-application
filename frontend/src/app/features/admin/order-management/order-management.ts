import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from '../../../core/services/order-service';
import { OrderDto } from '../../../core/models/order.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select'
import { LoadingSpinner } from "../../../shared/loading-spinner/loading-spinner";
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth-service';
import { UserDto } from '../../../core/models/auth.model';
import { MatDialog } from '@angular/material/dialog';
import { OrderDetailsManement } from './order-details-manement/order-details-manement';

@Component({
  selector: 'app-order-management',
  imports: [MatFormFieldModule, MatSelectModule, LoadingSpinner, DatePipe, CurrencyPipe],
  templateUrl: './order-management.html',
  styleUrl: './order-management.css'
})
export class OrderManagement implements OnInit {

  service = inject(OrderService);
  destroyRef = inject(DestroyRef);
  router = inject(Router);
  dsRef = inject(DestroyRef);
  snackBar = inject(MatSnackBar);
  authService = inject(AuthService);

  dialog = inject(MatDialog);

  // Data
  orders = signal<OrderDto[] | null>(null);

  user = signal<UserDto | null>(null);

  // UI State
  isLoading = signal<boolean>(false);
  error: string | null = null;

  // Filtering & Sorting
  selectedStatus: string | null = null;
  sortOption: 'date' | 'amount' = 'date';

  // Assuming your OrderDto has a 'status' property
  readonly validStatuses = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

  ngOnInit() {
    this.loadProfile();
    this.loadOrders();
  }

  loadProfile() {
    const sub = this.authService.getUserProfile().subscribe({
      next: res => {
        this.user.set(res);
      },
      error: error => {
        this.error = error;
      }
    });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  loadOrders() {
    this.isLoading.set(true);
    this.error = null;
    const sub = this.service.getAdminAllOrders()
      .subscribe({
        next: (response) => {
          console.log('Admin Orders:', response);
          this.orders.set(response);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error loading admin orders:', error);
          this.error = 'Failed to load orders. Please try again later.';
          this.isLoading.set(false);
        }
      });
    this.dsRef.onDestroy(() => sub.unsubscribe());
  }

  get filteredOrders(): OrderDto[] {
    const allOrders = this.orders();
    if (!allOrders) return [];

    let filtered = allOrders;

    if (this.selectedStatus) {
      filtered = filtered.filter(order => order.status === this.selectedStatus);
    }

    filtered.sort((a, b) => {
      if (this.sortOption === 'date') {
        const dateA = new Date(a.orderDate).getTime();
        const dateB = new Date(b.orderDate).getTime();
        return this.isSortDescending ? dateB - dateA : dateA - dateB;
      } else if (this.sortOption === 'amount') {
        return this.isSortDescending ? b.totalAmount - a.totalAmount : a.totalAmount - b.totalAmount;
      }
      return 0;
    });

    return filtered;
  }

  isSortDescending = true;
  toggleSortDirection() {
    this.isSortDescending = !this.isSortDescending;
  }

  viewOrder(orderId: number) {
    this.dialog.open(OrderDetailsManement, { data: { orderId }, width: "90%", height: "40%" });
  }

  updateOrderStatus(orderId: number, newStatus: string) {
    const user = this.user();
    if (!user) return;

    const sub = this.service.updateOrderStatus({ orderId: orderId, status: newStatus, updatedBy: user.id }).subscribe({
      next: (res) => {
        this.isLoading.set(false)
        this.snackBar.open("Order status updated Successful", "Ok", { duration: 4000 });
        this.loadOrders();
      },
      error: (error) => {
        console.log(error);
        this.isLoading.set(false)
        this.snackBar.open("Order status updated failed", "Ok", { duration: 4000 });
      }
    });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  resetFilters() {
    this.selectedStatus = null;
  }

  getStatusBadgeClass(status: string): string {
    // Reuse logic from your existing OrderList component if applicable
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Confirmed': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-indigo-100 text-indigo-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}
