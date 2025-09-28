import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoadingSpinner } from "../../../shared/loading-spinner/loading-spinner";
import { MatIconModule } from '@angular/material/icon'
import { ProductService } from '../../../core/services/product-service';
import { ProductDto } from '../../../core/models/product.model';
import { CategoryDto } from '../../../core/models/category.model';
import { CategoryService } from '../../../core/services/category-service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddForm } from './add-form/add-form';
import { EditForm } from './edit-form/edit-form';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-management',
  imports: [LoadingSpinner, ReactiveFormsModule, MatIconModule, MatDialogModule, MatSnackBarModule, CurrencyPipe],
  templateUrl: './product-management.html',
  styleUrl: './product-management.css'
})
export class ProductManagement implements OnInit {
  // UI State
  isLoading = signal(false);
  service = inject(ProductService);
  snackBar = inject(MatSnackBar);

  destroyRef = inject(DestroyRef);
  products = signal<ProductDto[] | null>([]);
  categoryService = inject(CategoryService);

  isModalOpen = false;
  isEditing = false;
  error: string | null = null;
  selectedProduct: ProductDto | null = null;

  // categories
  categories_ = signal<CategoryDto[] | null>(null);

  // Forms
  productForm: FormGroup;

  dialog = inject(MatDialog);

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

  openDialog() {
    const dialogRef = this.dialog.open(AddForm, { width: "80%", height: "80%" });
    const sub = dialogRef.afterClosed().subscribe({
      next: product => {
        if (!product) return;
        const sub = this.service.createProduct(product).subscribe({
          next: res => {
            this.snackBar.open("Item added successfully.", "Ok", { duration: 3000 });
            this.loadproducts();
          },
          error: error => {
            console.log('Admin Products: ', error);
            this.snackBar.open(`Failed to add product`, "Ok", { duration: 4000 });
          }
        });
        this.destroyRef.onDestroy(() => sub.unsubscribe());
      },
      error: error => {
        this.error = error;
        console.log('Form Error: ', error);
      }
    });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  openEditDialog(prod: ProductDto) {
    console.log(prod);

    const editDialogRef = this.dialog.open(EditForm, { width: "80%", height: "80%", data: { product: prod, categories_: this.categories_() } });
    const sub = editDialogRef.afterClosed().subscribe({
      next: product => {
        if (!product) return;
        console.log('form-data: ', product);

        const sub = this.service.updateProductDetails(prod.id, product).subscribe({
          next: () => {
            this.snackBar.open("Product Updated successfully.", "Ok", { duration: 5000 });
            this.loadproducts();
          },
          error: error => {
            this.snackBar.open(`${error}`, "Ok", { duration: 5000 });
          }
        });
        this.destroyRef.onDestroy(() => sub.unsubscribe());
      }
    });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  loadCategories() {
    this.isLoading.set(true);
    let sub = this.categoryService.getAllCategories().subscribe({
      next: categories => {
        this.categories_.set(categories);
        this.isLoading.set(false);
      },
      error: error => {
        this.error = error;
        this.isLoading.set(false);
      }
    });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
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
        this.isLoading.set(false);
      }
    });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
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
