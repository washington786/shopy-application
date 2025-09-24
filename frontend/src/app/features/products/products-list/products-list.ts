import { NgFor, NgIf } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon'
import { LoadingSpinner } from "../../../shared/loading-spinner/loading-spinner";
import { ProductCard } from "../../../shared/product-card/product-card";
import { ProductService } from '../../../core/services/product-service';
import { ProductDto } from '../../../core/models/product.model';

@Component({
  selector: 'app-products-list',
  imports: [FormsModule, NgFor, NgIf, MatIconModule, LoadingSpinner, ProductCard],
  templateUrl: './products-list.html',
  styleUrl: './products-list.css'
})
export class ProductsList {
  // Mock categories
  categories = [
    { id: 1, name: 'Electronics', productCount: 12 },
    { id: 2, name: 'Books', productCount: 8 },
    { id: 3, name: 'Clothing', productCount: 15 },
    { id: 4, name: 'Home & Kitchen', productCount: 20 }
  ];

  service = inject(ProductService);
  router = inject(Router);
  destroyRef = inject(DestroyRef);
  products: ProductDto[] = [];

  // Mock products
  // products = [
  //   {
  //     id: 1,
  //     name: 'Wireless Headphones',
  //     description: 'High-quality wireless headphones with noise cancellation.',
  //     price: 99.99,
  //     stock: 50,
  //     productImageUrl: '/assets/images/headphones.jpg',
  //     categoryId: 1,
  //     categoryName: 'Electronics',
  //     createdAt: '2024-01-15T10:30:00Z',
  //     updatedAt: null
  //   },
  //   {
  //     id: 2,
  //     name: 'C# in Depth',
  //     description: 'Master C# with this comprehensive guide.',
  //     price: 45.5,
  //     stock: 30,
  //     productImageUrl: '/assets/images/csharp-book.jpg',
  //     categoryId: 2,
  //     categoryName: 'Books',
  //     createdAt: '2024-02-20T14:15:00Z',
  //     updatedAt: null
  //   },
  //   {
  //     id: 3,
  //     name: 'Cotton T-Shirt',
  //     description: 'Comfortable 100% cotton t-shirt.',
  //     price: 19.99,
  //     stock: 100,
  //     productImageUrl: '/assets/images/tshirt.jpg',
  //     categoryId: 3,
  //     categoryName: 'Clothing',
  //     createdAt: '2024-03-10T09:45:00Z',
  //     updatedAt: null
  //   },
  //   {
  //     id: 4,
  //     name: 'Coffee Maker',
  //     description: 'Automatic coffee maker with programmable timer.',
  //     price: 79.99,
  //     stock: 25,
  //     productImageUrl: '/assets/images/coffee-maker.jpg',
  //     categoryId: 4,
  //     categoryName: 'Home & Kitchen',
  //     createdAt: '2024-04-05T16:20:00Z',
  //     updatedAt: null
  //   },
  //   {
  //     id: 5,
  //     name: 'Bluetooth Speaker',
  //     description: 'Portable Bluetooth speaker with 20-hour battery life.',
  //     price: 59.99,
  //     stock: 40,
  //     productImageUrl: '/assets/images/bluetooth-speaker.jpg',
  //     categoryId: 1,
  //     categoryName: 'Electronics',
  //     createdAt: '2024-05-12T11:10:00Z',
  //     updatedAt: null
  //   },
  //   {
  //     id: 6,
  //     name: 'Python Programming',
  //     description: 'Learn Python programming from scratch.',
  //     price: 39.99,
  //     stock: 35,
  //     productImageUrl: '/assets/images/python-book.jpg',
  //     categoryId: 2,
  //     categoryName: 'Books',
  //     createdAt: '2024-06-18T13:40:00Z',
  //     updatedAt: null
  //   }
  // ];

  // UI State
  selectedCategory: number | null = null;
  searchQuery: string = '';
  isLoading = false;
  error: string | null = null;
  currentPage = 1;
  itemsPerPage = 6;

  ngOnInit() {
    // this.isLoading = true;
    // // Simulate API delay
    let sub = this.service.getAllProducts().subscribe({
      next: res => {
        this.products = res;
        this.isLoading = false;
      },
      error: err => {
        this.error = err;
        this.isLoading == false;
      }
    });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  get filteredProducts() {
    return this.products.filter(product => {
      const matchesCategory = this.selectedCategory ? product.categoryId === this.selectedCategory : true;
      const matchesSearch = this.searchQuery ? product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) : true;
      return matchesCategory && matchesSearch;
    });
  }

  get paginatedProducts() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredProducts.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  }

  viewProduct(id: number) {
    this.router.navigate(['/products', id]);
  }

  filterByCategory(categoryId: number | null) {
    this.selectedCategory = categoryId;
    this.currentPage = 1;
  }

  onSearch() {
    this.currentPage = 1;
  }

  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}
