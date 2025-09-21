import { inject, Injectable } from '@angular/core';
import { ApiService } from './api-service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiService = inject(ApiService);
  private authUrl = `/orders/`;

  createOrder() { }

  getAllOrders() { }

  getOrderById() { }

  updateOrderStatus() { }
}
