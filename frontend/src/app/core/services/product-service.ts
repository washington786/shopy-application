import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private authUrl = `${environment.apiUrl}/products/`;

  loadProducts() { }

  getProduct() { }

  updateProductDetails() { }

  removeProduct() { }

  createProduct() { }
}
