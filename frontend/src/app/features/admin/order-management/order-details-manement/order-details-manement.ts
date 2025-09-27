import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { LoadingSpinner } from "../../../../shared/loading-spinner/loading-spinner";
import { OrderService } from '../../../../core/services/order-service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { MatListModule } from '@angular/material/list';

import { MatCardModule } from '@angular/material/card'
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrderDto, OrderItemDto } from '../../../../core/models/order.model';

@Component({
  selector: 'app-order-details-manement',
  imports: [LoadingSpinner, MatCardModule, DatePipe, MatListModule, CurrencyPipe],
  templateUrl: './order-details-manement.html',
  styleUrl: './order-details-manement.css'
})
export class OrderDetailsManement implements OnInit {
  service = inject(OrderService);
  dialogRef = inject(MatDialogRef<OrderDetailsManement>);

  data = inject<{ orderId: number }>(MAT_DIALOG_DATA);

  orderId: number = this.data.orderId;

  destroyRef = inject(DestroyRef);

  snackBar = inject(MatSnackBar);

  isLoading = signal<boolean>(false);
  error: string | null = null;

  order = signal<OrderDto | null>(null);

  loadOrderDetails(id: number) {
    this.isLoading.set(true);
    const sub = this.service.getAdminOrderById(id).subscribe({
      next: res => {
        this.order.set(res);
        this.isLoading.set(false);
      },
      error: error => {
        console.log("Failed order Fetching: ", error);
        this.snackBar.open("Failed to fetch order", "Ok", { duration: 4000 });
        this.error = "Sorry, Failed to fetch order details. try again later!";
        this.isLoading.set(false);
      }
    });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  getItemTotal(item: OrderItemDto): number {
    return item.quantity * item.unitPrice;
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Confirmed': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-indigo-100 text-indigo-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  ngOnInit(): void {
    this.loadOrderDetails(this.orderId);
  }
}
