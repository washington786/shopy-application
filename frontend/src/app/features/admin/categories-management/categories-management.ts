import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CategoryDto, CreateCategoryRequest, UpdateCategoryRequest } from '../../../core/models/category.model';
import { CategoryService } from '../../../core/services/category-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoadingSpinner } from "../../../shared/loading-spinner/loading-spinner";

@Component({
  selector: 'app-categories-management',
  imports: [ReactiveFormsModule, LoadingSpinner],
  templateUrl: './categories-management.html',
  styleUrl: './categories-management.css'
})
export class CategoriesManagement implements OnInit {
  private service = inject(CategoryService);
  private fb = inject(FormBuilder);

  categories: CategoryDto[] = [];
  isLoading = false;
  error: string | null = null;
  editingCategory: CategoryDto | null = null;

  load = signal(false);

  destroyRef = inject(DestroyRef);

  categoryForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    description: [''],
    isActive: [true]
  });

  ngOnInit() {
    this.loadCategories();
  }


  loadCategories() {
    this.isLoading = true;
    this.error = null;
    this.load.set(true);
    let sub = this.service.getAllCategories().subscribe({
      next: (data) => {
        console.log('categories: ', data);
        this.categories = data;
        this.load.set(false)
        console.log('categories loading: ', this.load());
      },
      error: (err) => {
        this.error = 'Failed to load categories.';
        console.error(err);
        this.load.set(false);
      }
    });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  onSubmit() {
    if (this.categoryForm.invalid) return;

    this.isLoading = true;
    const formData = this.categoryForm.value;

    if (this.editingCategory) {
      const request: UpdateCategoryRequest = {
        id: this.editingCategory.id,
        name: formData.name,
        description: formData.description,
      };

      this.service.updateCategoryItem(this.editingCategory.id, request).subscribe({
        next: () => {
          this.resetForm();
          this.loadCategories();
        },
        error: (err: Error) => {
          this.error = 'Failed to update category.';
          this.isLoading = false;
          console.error(err);
        }
      });

    } else {
      const request: CreateCategoryRequest = {
        name: formData.name,
        description: formData.description
      };
      this.service.createCategoryItem(request).subscribe({
        next: () => {
          this.resetForm();
          this.loadCategories();
        },
        error: (err: Error) => {
          this.error = 'Failed to create category.';
          this.isLoading = false;
          console.error(err);
        }
      });
    }
  }

  editCategory(category: CategoryDto) {
    this.editingCategory = category;
    this.categoryForm.patchValue({
      name: category.name,
      description: category.description,
    });
  }

  cancelEdit() {
    this.resetForm();
  }

  deleteCategory(id: number) {
    if (confirm('Are you sure you want to delete this category?')) {
      this.isLoading = true;
      this.service.removeCategoryItem(id).subscribe({
        next: () => this.loadCategories(),
        error: (error: Error) => {
          this.error = 'Failed to delete category.';
          this.isLoading = false;
          console.error(error);
        }
      });
    }
  }

  private resetForm() {
    this.editingCategory = null;
    this.categoryForm.reset({
      name: '',
      description: '',
      isActive: true
    });
  }
}
