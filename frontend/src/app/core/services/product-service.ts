import { inject, Injectable } from '@angular/core';
import { ApiService } from './api-service';
import { CreateProductRequest, ProductDto, UpdateProductRequest } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiService = inject(ApiService);
  private productsUrl = `/products`;

  getAllProducts() {
    this.apiService.get<ProductDto[]>(`${this.productsUrl}/all-products`);
  }

  getProduct(id: number) {
    return this.apiService.get<ProductDto>(`${this.productsUrl}/${id}`);
  }

  updateProductDetails(id: number, request: UpdateProductRequest) {
    return this.apiService.put<ProductDto>(`${this.productsUrl}/${id}`, request);
  }

  removeProduct(id: number) {
    return this.apiService.delete<void>(`${this.productsUrl}/${id}`)
  }

  createProduct(request: CreateProductRequest) {
    return this.apiService.post<ProductDto>(`${this.productsUrl}`, request);
  }
}
