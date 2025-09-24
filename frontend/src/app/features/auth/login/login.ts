import { Component, computed, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field'
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectAuthError, selectAuthLoading, selectIsAuthenticated } from '../../../store/selectors/auth-selector';
import { loginAction } from '../../../store/actions/auth-actions';
import { AsyncPipe } from '@angular/common';
import { LoadingSpinner } from "../../../shared/loading-spinner/loading-spinner";
import { LoginRequest } from '../../../core/models/auth.model';
import { AuthService } from '../../../core/services/auth-service';
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, MatInputModule, MatFormFieldModule, AsyncPipe, LoadingSpinner],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {

  formBuilder = inject(FormBuilder);
  form!: FormGroup;

  router = inject(Router);

  store = inject(AuthService);

  destroyRef = inject(DestroyRef);

  isLoading$: boolean = false;
  error$: string | null = null;
  isAuthenticated$: boolean = false;

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    // this.error$ = this.store.select(selectAuthError);
    // this.isLoading$ = this.store.select(selectAuthLoading);
    // this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
  }

  passwordRequiredError = computed(() => this.form.get('password')?.errors?.["required"])
  passwordMinLengthError = computed(() => this.form.get('password')?.errors?.["minlength"])
  emailRequiredError = computed(() => this.form.get('email')?.errors?.["required"])
  emailValidError = computed(() => this.form.get('email')?.errors?.["email"])

  onSubmit() {
    this.isLoading$ = true;
    if (!this.form.valid) return;
    const loginRequest: LoginRequest = this.form.value;
    // console.log("login: \n", loginRequest);
    let sub = this.store.loginUser(loginRequest).subscribe({
      next: res => {
        localStorage.setItem("token", res.token);
        this.isLoading$ = false;
        this.router.navigate(["/app/products"]);
      },
      error: (err) => {
        this.error$ = err;
        this.isLoading$ = false;
      },
    });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  goToRegister() {
    this.router.navigate(["/auth/register"]);
  }
}
