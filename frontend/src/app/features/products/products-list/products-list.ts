import { Component, OnInit, computed, DestroyRef, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { LoadingSpinner } from "../../../shared/loading-spinner/loading-spinner";
import { ProductCard } from "../../../shared/product-card/product-card";
import { ProductService } from '../../../core/services/product-service';
import { ProductDto } from '../../../core/models/product.model';
import { CategoryService } from '../../../core/services/category-service';
import { CategoryDto } from '../../../core/models/category.model';

@Component({
  selector: 'app-products-list',
  imports: [
    FormsModule,
    MatIconModule,
    LoadingSpinner,
    ProductCard
  ],
  templateUrl: './products-list.html',
  styleUrl: './products-list.css'
})
export class ProductsList implements OnInit {
  private service = inject(ProductService);
  private categoriesService = inject(CategoryService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  // Data signals
  allProducts = signal<ProductDto[]>([]);
  categories = signal<CategoryDto[]>([]);

  // UI State
  selectedCategory: number | null = null;
  searchQuery: string = '';
  isLoading = signal<boolean>(false);
  currentPage = 1;
  itemsPerPage = 6;

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts() {
    this.isLoading.set(true);
    const sub = this.service.getAllProducts().subscribe({
      next: (res) => {
        this.allProducts.set(res || []);
        this.isLoading.set(false);
      },
      error: () => {
        this.allProducts.set([]);
        this.isLoading.set(false);
      }
    });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  loadCategories() {
    this.isLoading.set(true);
    const sub = this.categoriesService.getAllCategories().subscribe({
      next: (res) => {
        this.categories.set(res || []);
        this.isLoading.set(false);
      },
      error: () => {
        this.categories.set([]);
        this.isLoading.set(false);
      }
    });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  filteredProducts = computed(() => {
    const products = this.allProducts();
    return products.filter(product => {
      const matchesCategory = this.selectedCategory !== null
        ? product.categoryId === this.selectedCategory
        : true;
      const matchesSearch = this.searchQuery.trim()
        ? product.name.toLowerCase().includes(this.searchQuery.toLowerCase().trim())
        : true;
      return matchesCategory && matchesSearch;
    });
  });

  paginatedProducts = computed(() => {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredProducts().slice(startIndex, startIndex + this.itemsPerPage);
  });

  totalPages = computed(() => {
    return Math.ceil(this.filteredProducts().length / this.itemsPerPage);
  });
  pageNumbers = computed(() => {
    const total = this.totalPages();
    return total > 0 ? Array.from({ length: total }, (_, i) => i + 1) : [];
  });

  viewProduct(id: number) {
    this.router.navigate(['/app/product-detail/', id]);
  }

  filterByCategory(categoryId: number | null) {
    this.selectedCategory = categoryId;
    this.currentPage = 1;
  }

  onSearch() {
    this.currentPage = 1;
  }

  clearSearch() {
    this.searchQuery = '';
    this.onSearch();
  }

  clearFilters() {
    this.searchQuery = '';
    this.selectedCategory = null;
    this.currentPage = 1;
  }

  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage = page;
    }
  }
}
