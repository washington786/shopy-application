import { Component, computed, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field'
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectAuthError, selectAuthLoading } from '../../../store/selectors/auth-selector';
import { loginAction } from '../../../store/actions/auth-actions';
import { AsyncPipe } from '@angular/common';
import { LoadingSpinner } from "../../../shared/loading-spinner/loading-spinner";
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

  store = inject(Store);

  isLoading$!: Observable<boolean>;
  error$!: Observable<string | null>;

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    this.error$ = this.store.select(selectAuthError);
    this.isLoading$ = this.store.select(selectAuthLoading);
  }

  passwordRequiredError = computed(() => this.form.get('password')?.errors?.["required"])
  passwordMinLengthError = computed(() => this.form.get('password')?.errors?.["minlength"])
  emailRequiredError = computed(() => this.form.get('email')?.errors?.["required"])
  emailValidError = computed(() => this.form.get('email')?.errors?.["email"])

  onSubmit() {
    if (!this.form.valid) return;
    this.store.dispatch(loginAction(this.form.value));
    this.router.navigate(["/app"])
  }



  goToRegister() {
    this.router.navigate(["/auth/register"]);
  }
}
