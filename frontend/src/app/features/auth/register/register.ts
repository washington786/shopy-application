import { Component, computed, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingSpinner } from "../../../shared/loading-spinner/loading-spinner";
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectAuthError, selectAuthLoading } from '../../../store/selectors/auth-selector';
import { RegisterRequest } from '../../../core/models/auth.model';
import { registerAction } from '../../../store/actions/auth-actions';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, LoadingSpinner, AsyncPipe],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register implements OnInit {
  formBuilder = inject(FormBuilder);
  form!: FormGroup;

  router = inject(Router);

  isLoading$!: Observable<boolean>;
  error$!: Observable<string | null>;

  store = inject(Store);

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]],
      fullName: ['', [Validators.required]]
    });

    this.isLoading$ = this.store.select(selectAuthLoading);
    this.error$ = this.store.select(selectAuthError);
  }

  emailRequiredError = computed(() => this.form.get('email')?.errors?.["required"]);
  emailValidError = computed(() => this.form.get('email')?.errors?.["email"]);

  passwordRequiredError = computed(() => this.form.get("password")?.errors?.["required"]);
  passwordMinLengthError = computed(() => this.form.get("password")?.errors?.["minlength"]);

  fullNameRequiredError = computed(() => this.form.get("fullName")?.errors?.["required"]);
  fullNameMinLengthError = computed(() => this.form.get("fullName")?.errors?.["minLength"]);

  onSubmit() {
    if (!this.form.valid) return;
    const request: RegisterRequest = this.form.value;
    this.store.dispatch(registerAction({ registerRequest: request }));
  }

  goToLogin() {
    this.router.navigate(["/auth/login"]);
  }
}
