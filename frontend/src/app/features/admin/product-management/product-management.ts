import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoadingSpinner } from "../../../shared/loading-spinner/loading-spinner";
import { MatIconModule } from '@angular/material/icon'
import { ProductService } from '../../../core/services/product-service';
import { ProductDto } from '../../../core/models/product.model';
@Component({
  selector: 'app-product-management',
  imports: [LoadingSpinner, ReactiveFormsModule, MatIconModule],
  templateUrl: './product-management.html',
  styleUrl: './product-management.css'
})
export class ProductManagement implements OnInit {

  // Mock categories
  categories = [
    { id: 1, name: 'Electronics' },
    { id: 2, name: 'Books' },
    { id: 3, name: 'Clothing' },
    { id: 4, name: 'Home & Kitchen' }
  ];

  // UI State
  isLoading = signal(false);
  service = inject(ProductService);
  destroyRef = inject(DestroyRef);
  products = signal<ProductDto[] | null>([]);
  isModalOpen = false;
  isEditing = false;
  error: string | null = null;
  selectedProduct: ProductDto | null = null;

  // Forms
  productForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0.01)]],
      stock: ['', [Validators.required, Validators.min(0)]],
      productImageUrl: [''],
      categoryId: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadproducts();
  }

  loadproducts() {
    this.isLoading.set(true);
    let sub = this.service.getAllProducts().subscribe({
      next: products => {
        this.products.set(products);
        this.isLoading.set(false);
      },
      error: error => {
        this.error = error;
      }
    });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  openCreateModal() {
    this.isEditing = false;
    this.selectedProduct = null;
    this.productForm.reset({
      name: '',
      description: '',
      price: '',
      stock: '',
      productImageUrl: '',
      categoryId: ''
    });
    this.isModalOpen = true;
  }

  openEditModal(product: any) {
    this.isEditing = true;
    this.selectedProduct = { ...product };
    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      productImageUrl: product.productImageUrl,
      categoryId: product.categoryId
    });
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  onSubmit() {
    if (this.productForm.invalid) {
      this.markFormGroupTouched(this.productForm);
      return;
    }

    this.isLoading.set(true);

    const formData = this.productForm.value;
    if (this.isEditing && this.selectedProduct) {

      let sub = this.service.updateProductDetails(this.selectedProduct.id, formData).subscribe({
        next: res => {
          this.products.update(prod => {
            if (!prod) return null;
            return prod.map(p => p.id === res.id ? res : p)
          })
          this.isLoading.set(false);
        },
        error: error => {
          this.error = error;
        }
      });
      this.destroyRef.onDestroy(() => sub.unsubscribe());
    } else {
      let sub = this.service.createProduct(formData).subscribe({
        next: response => {
          this.products.update(products => {
            if (!products) return [response];
            return [...products, response];
          });
          this.isLoading.set(false);
        },
        error: error => {
          this.error = error;
          this.isLoading.set(false);
        }
      });
      this.destroyRef.onDestroy(() => sub.unsubscribe());
    }
  }

  deleteProduct(id: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      let sub = this.service.removeProduct(id).subscribe({
        next: () => {
          this.loadproducts();
        },
        error: error => {
          this.error = error;
        }
      });
      this.destroyRef.onDestroy(() => sub.unsubscribe());
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
