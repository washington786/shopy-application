import { Component, DestroyRef, inject, Input, OnInit, signal } from '@angular/core';
import { ProductDto } from '../../../../core/models/product.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryDto } from '../../../../core/models/category.model';
import { CategoryService } from '../../../../core/services/category-service';

@Component({
  selector: 'app-edit-form',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-form.html',
  styleUrl: './edit-form.css'
})
export class EditForm implements OnInit {
  data = inject<{ product: ProductDto, categories_: CategoryDto[] }>(MAT_DIALOG_DATA);

  product = this.data.product;
  categories_ = this.data.categories_;

  categories = signal<CategoryDto[]>([]);

  service = inject(CategoryService);

  dialogRef = inject(MatDialogRef<EditForm>);

  productForm!: FormGroup;
  formBuilder = inject(FormBuilder);

  desRef = inject(DestroyRef);

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      categoryId: ['', [Validators.required]],
      productImageUrls: [''],
      price: ['', [Validators.required]],
      stock: ['', [Validators.required]],
    });

    this.productForm.patchValue({
      name: this.product.name,
      description: this.product.description,
      stock: this.product.stock,
      price: this.product.price,
      productImageUrls: this.product.ImageUrls?.at(0),
      categoryId: this.product.categoryId
    });
    this.loadCategories();
  }

  loadCategories() {
    const sub = this.service.getAllCategories().subscribe({
      next: res => {
        this.categories.set(res);
      },
      error: error => {
        console.log(error);
      }
    });
    this.desRef.onDestroy(() => sub.unsubscribe());
  }

  onSubmit() {
    if (this.productForm.invalid) return;
    const { name, description, stock, price, productImageUrls, categoryId } = this.productForm.value;
    const formData = {
      name, description, stock, price, imageUrls: [productImageUrls], categoryId
    };
    this.dialogRef.close(formData);
  }
}
