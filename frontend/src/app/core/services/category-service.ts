import { inject, Injectable } from '@angular/core';
import { ApiService } from './api-service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiService = inject(ApiService);
  private authUrl = `/categories/`;

  getAllCategories() { }

  getCategoryItem() { }

  updateCategoryItem() { }

  createCategoryItem() { }

  removeCategoryItem() { }
}
