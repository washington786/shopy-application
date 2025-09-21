import { inject, Injectable } from '@angular/core';
import { ApiService } from './api-service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiService = inject(ApiService);
  private productsUrl = `/products/`;

  getAllProducts() { }

  getProduct() { }

  updateProductDetails() { }

  removeProduct() { }

  createProduct() { }
}
