import { inject, Injectable } from '@angular/core';
import { ApiService } from './api-service';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private apiService = inject(ApiService);
  private authUrl = `/payment/`;

  CreatePayment() { }
}
