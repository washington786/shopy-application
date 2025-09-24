import { inject, Injectable } from '@angular/core';
import { ApiService } from './api-service';
import { CategoryDto, CreateCategoryRequest, UpdateCategoryRequest } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiService = inject(ApiService);
  private url = `/categories`;

  getAllCategories() {
    return this.apiService.get<CategoryDto[]>(`${this.url}/all`)
  }

  getCategoryItem(id: number) {
    return this.apiService.get<CategoryDto>(`${this.url}/${id}`);
  }

  updateCategoryItem(id: number, request: UpdateCategoryRequest) {
    return this.apiService.put<CategoryDto>(`${this.url}/${id}`, request);
  }

  createCategoryItem(request: CreateCategoryRequest) {
    return this.apiService.post<CategoryDto>(`${this.url}/create`, request);
  }

  removeCategoryItem(id: number) {
    return this.apiService.delete<void>(`${this.url}/${id}`)
  }
}
