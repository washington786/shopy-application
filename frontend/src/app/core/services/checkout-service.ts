import { inject, Injectable } from '@angular/core';
import { ApiService } from './api-service';
import { CheckoutSessionResponse } from '../models/checkout.model';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private apiService = inject(ApiService);
  private url = `/payment/`;

  CreatePayment() {
    return this.apiService.post<CheckoutSessionResponse>(`${this.url}/order-payment`, {});
  }
}
