import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { LoadingSpinner } from "../../../shared/loading-spinner/loading-spinner";
@Component({
  selector: 'app-products-details',
  imports: [MatIconModule, NgFor, NgIf, DatePipe, LoadingSpinner],
  templateUrl: './products-details.html',
  styleUrl: './products-details.css'
})
export class ProductsDetails implements OnInit {
  product = {
    id: 1,
    name: 'Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation. Perfect for music lovers and professionals. Features 30-hour battery life, Bluetooth 5.0, and comfortable ear cushions.',
    price: 99.99,
    stock: 50,
    productImageUrl: '/assets/images/headphones.jpg',
    categoryId: 1,
    categoryName: 'Electronics',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: null,
    images: [
      '/assets/images/headphones.jpg',
      '/assets/images/headphones-2.jpg',
      '/assets/images/headphones-3.jpg'
    ]
  };

  // UI State
  selectedImage: string = this.product.productImageUrl;
  quantity: number = 1;
  isLoading = false;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    // In real app, we'd load product by ID
    // For now, we use mock data
    console.log('Loading product with ID:', id);
  }

  selectImage(imageUrl: string) {
    this.selectedImage = imageUrl;
  }

  updateQuantity(change: number) {
    this.quantity = Math.max(1, this.quantity + change);
  }

  addToCart() {
    this.isLoading = true;
    // TODO: Connect to CartService later
    console.log('Add to cart', { productId: this.product.id, quantity: this.quantity });

    // Simulate API delay
    setTimeout(() => {
      this.isLoading = false;
      // Show success message or redirect to cart
      alert(`Added ${this.quantity} ${this.product.name} to cart!`);
    }, 1000);
  }

  goToProducts() {
    this.router.navigate(['/products']);
  }
}
