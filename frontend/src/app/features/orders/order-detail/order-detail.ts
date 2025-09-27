import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingSpinner } from "../../../shared/loading-spinner/loading-spinner";
import { CurrencyPipe, DatePipe } from '@angular/common';
import { OrderDto } from '../../../core/models/order.model';
import { OrderService } from '../../../core/services/order-service';

@Component({
  selector: 'app-order-detail',
  imports: [LoadingSpinner, DatePipe, CurrencyPipe],
  templateUrl: './order-detail.html',
  styleUrl: './order-detail.css'
})
export class OrderDetail implements OnInit {
  // service
  service = inject(OrderService);
  dsRef = inject(DestroyRef);

  order = signal<OrderDto | null>(null)

  // UI State
  isLoading = signal<boolean>(false);
  route = inject(ActivatedRoute);
  router = inject(Router);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.loadOrder(parseInt(id!));
  }

  loadOrder(id: number) {
    const sub = this.service.getOrderById(id).subscribe({
      next: order => {
        this.order.set(order);
        this.isLoading.set(false)
      },
      error: error => {
        this.isLoading.set(false);
      }
    });
    this.dsRef.onDestroy(() => sub.unsubscribe());
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
