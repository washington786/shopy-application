import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../../../core/services/category-service';
import { CategoryDto } from '../../../../core/models/category.model';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-form',
  imports: [ReactiveFormsModule],
  templateUrl: './add-form.html',
  styleUrl: './add-form.css'
})
export class AddForm implements OnInit {
  productForm: FormGroup;

  categoryService = inject(CategoryService);
  destroyRef = inject(DestroyRef);

  isLoading = signal<boolean>(false);
  categories_ = signal<CategoryDto[] | null>([]);
  error: string | null = null;

  dialogProductRef = inject(MatDialogRef<AddForm>);

  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0.01)]],
      stock: ['', [Validators.required, Validators.min(0)]],
      productImageUrls: [''],
      categoryId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  onSubmit() {
    if (this.productForm.invalid) return;
    const { name, description, price, stock, productImageUrls, categoryId } = this.productForm.value;
    const formData = {
      name, description, price, stock, imageUrls: [productImageUrls], categoryId
    }
    this.dialogProductRef.close(formData);
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

}
