import { inject, Injectable } from '@angular/core';
import { ApiService } from './api-service';
import { CreateOrderRequest, OrderDto, UpdateOrderStatus } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiService = inject(ApiService);
  private url = `orders`;

  createOrder(request: CreateOrderRequest) {
    return this.apiService.post<OrderDto>(`/${this.url}/create-order`, request);
  }

  getAllOrders() {
    return this.apiService.get<OrderDto[]>(`/${this.url}/all-orders`)
  }

  getAdminAllOrders() {
    return this.apiService.get<OrderDto[]>(`/${this.url}/admin-all-orders`)
  }

  getOrderById(id: number) {
    return this.apiService.get<OrderDto>(`/${this.url}/${id}`);
  }

  getAdminOrderById(id: number) {
    return this.apiService.get<OrderDto>(`/${this.url}/admin/${id}`);
  }

  updateOrderStatus(request: UpdateOrderStatus) {
    return this.apiService.put<OrderDto>(`${this.url}/status`, request)
  }

}
