import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingSpinner } from "../../../shared/loading-spinner/loading-spinner";

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, LoadingSpinner],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {
  formBuilder = inject(FormBuilder);
  form!: FormGroup;

  router = inject(Router);

  isLoading: boolean = false;
  errorMessage: string | null = null;
  isEditing: boolean = false;
  successMessage: string | null = null;

  mockUser = {
    id: '1',
    email: 'user@example.com',
    fullName: 'John Doe',
    roles: ['User']
  };

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      fullName: ['', [Validators.required]]
    });

    this.form.patchValue({
      email: this.mockUser.email,
      fullName: this.mockUser.fullName
    })
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.form.enable();
    } else {
      this.form.disable();
    }
  }

  onSubmit() {
    if (!this.form.valid) return;
    this.router.navigate(["/"])
  }

  logout() {
    this.router.navigate(["/auth/login"]);
  }
}
