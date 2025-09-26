import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { LoadingSpinner } from "../../../shared/loading-spinner/loading-spinner";
import { ProductDto } from '../../../core/models/product.model';
import { ProductService } from '../../../core/services/product-service';
import { CartService } from '../../../core/services/cart-service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-products-details',
  imports: [MatIconModule, DatePipe, LoadingSpinner],
  templateUrl: './products-details.html',
  styleUrl: './products-details.css'
})
export class ProductsDetails implements OnInit {
  service = inject(ProductService);
  product = signal<ProductDto | null>(null);

  cartService = inject(CartService);

  // UI State
  selectedImage: string = this.product()?.ImageUrls?.at(-1)!;
  quantity: number = 1;
  isLoading = signal<boolean>(false);

  destroyRef = inject(DestroyRef);

  snackBar = inject(MatSnackBar);

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.loadProduct(id);
  }

  productImages = computed(() => this.product()?.ImageUrls);

  loadProduct(id: any) {
    this.isLoading.set(true);
    const sub = this.service.getProduct(id).subscribe({
      next: prod => {
        this.product.set(prod);
        this.isLoading.set(false);
      },
      error: error => {
        console.log('Error Product: ', error);
        this.isLoading.set(false);
      }
    });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  selectImage(imageUrl: string) {
    this.selectedImage = imageUrl;
  }

  updateQuantity(change: number) {
    this.quantity = Math.max(1, this.quantity + change);
  }

  addToCart() {
    this.isLoading.set(true);
    const sub = this.cartService.addToCart({ productId: this.product()?.id!, quantity: this.quantity }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.snackBar.open("Added product to cart", "Ok", { duration: 3000 });
        this.router.navigate(["/app/cart"]);
      },
      error: error => {
        console.log('Adding Cart Error: ', error);

        this.isLoading.set(false);
        this.snackBar.open(`Failed to add product to cart.`, "Ok", { duration: 4400 });
      }
    });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  goToProducts() {
    this.router.navigate(['/app/products']);
  }
}
