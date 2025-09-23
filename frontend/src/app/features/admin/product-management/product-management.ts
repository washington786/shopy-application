import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoadingSpinner } from "../../../shared/loading-spinner/loading-spinner";
import { NgFor, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon'
@Component({
  selector: 'app-product-management',
  imports: [LoadingSpinner, NgFor, NgIf, ReactiveFormsModule, MatIconModule],
  templateUrl: './product-management.html',
  styleUrl: './product-management.css'
})
export class ProductManagement implements OnInit {
  products = [
    {
      id: 1,
      name: 'Wireless Headphones',
      description: 'High-quality wireless headphones with noise cancellation.',
      price: 99.99,
      stock: 50,
      productImageUrl: '/assets/images/headphones.jpg',
      categoryId: 1,
      categoryName: 'Electronics'
    },
    {
      id: 2,
      name: 'C# in Depth',
      description: 'Master C# with this comprehensive guide.',
      price: 45.5,
      stock: 30,
      productImageUrl: '/assets/images/csharp-book.jpg',
      categoryId: 2,
      categoryName: 'Books'
    },
    {
      id: 3,
      name: 'Cotton T-Shirt',
      description: 'Comfortable 100% cotton t-shirt.',
      price: 19.99,
      stock: 100,
      productImageUrl: '/assets/images/tshirt.jpg',
      categoryId: 3,
      categoryName: 'Clothing'
    }
  ];

  // Mock categories
  categories = [
    { id: 1, name: 'Electronics' },
    { id: 2, name: 'Books' },
    { id: 3, name: 'Clothing' },
    { id: 4, name: 'Home & Kitchen' }
  ];

  // UI State
  isLoading = false;
  isModalOpen = false;
  isEditing = false;
  selectedProduct: any = null;

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
    this.isLoading = true;
    // Simulate API delay
    setTimeout(() => {
      this.isLoading = false;
    }, 800);
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

    this.isLoading = true;
    // TODO: Connect to ProductService later
    console.log('Product form submitted', {
      ...this.productForm.value,
      id: this.isEditing ? this.selectedProduct.id : null
    });

    // Simulate API delay
    setTimeout(() => {
      this.isLoading = false;
      if (this.isEditing) {
        // Update mock product
        const index = this.products.findIndex(p => p.id === this.selectedProduct.id);
        if (index !== -1) {
          this.products[index] = {
            ...this.products[index],
            ...this.productForm.value,
            categoryId: parseInt(this.productForm.value.categoryId),
            price: parseFloat(this.productForm.value.price),
            stock: parseInt(this.productForm.value.stock)
          };
        }
      } else {
        // Add new mock product
        const newProduct = {
          id: this.products.length + 1,
          ...this.productForm.value,
          categoryId: parseInt(this.productForm.value.categoryId),
          price: parseFloat(this.productForm.value.price),
          stock: parseInt(this.productForm.value.stock),
          categoryName: this.categories.find(c => c.id === parseInt(this.productForm.value.categoryId))?.name || 'Unknown'
        };
        this.products.push(newProduct);
      }
      this.closeModal();
    }, 1000);
  }

  deleteProduct(id: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      // TODO: Connect to ProductService later
      console.log('Delete product', id);
      this.products = this.products.filter(p => p.id !== id);
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
