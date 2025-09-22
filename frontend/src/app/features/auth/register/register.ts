import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingSpinner } from "../../../shared/loading-spinner/loading-spinner";

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, LoadingSpinner],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register implements OnInit {
  formBuilder = inject(FormBuilder);
  form!: FormGroup;

  router = inject(Router);

  isLoading: boolean = false;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]],
      fullName: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (!this.form.valid) return;
    this.router.navigate(["/"])
  }

  goToLogin() {
    this.router.navigate(["/auth/login"]);
  }
}
