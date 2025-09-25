import { Component, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingSpinner } from "../../../shared/loading-spinner/loading-spinner";
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UserDto } from '../../../core/models/auth.model';
import { selectAuthError, selectAuthLoading, selectAuthUser } from '../../../store/selectors/auth-selector';
import { logoutAction } from '../../../store/actions/auth-actions';
import { AsyncPipe } from '@angular/common';
import { AuthService } from '../../../core/services/auth-service';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, LoadingSpinner, AsyncPipe],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})

export class Profile {
  formBuilder = inject(FormBuilder);
  form!: FormGroup;

  router = inject(Router);

  store = inject(Store);

  destroy = inject(DestroyRef);

  user$!: Observable<UserDto | null>;

  isLoading$!: Observable<boolean>;
  errorMessage$!: Observable<string | null>;

  isEditing: boolean = false;
  successMessage: string | null = null;

  service = inject(AuthService);

  loadedUser: UserDto | null = null;
  error: string | null = null;

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      fullname: ['', [Validators.required]]
    });

    this.user$ = this.store.select(selectAuthUser);
    this.isLoading$ = this.store.select(selectAuthLoading);
    this.errorMessage$ = this.store.select(selectAuthError);

    const sub = this.service.getUserProfile().subscribe({
      next: res => {
        this.loadedUser = res;
        this.form.patchValue(res);
      }, error: (error) => {
        this.error = error;
      }
    });

    // let sub = this.user$.subscribe({
    //   next: (res) => {
    //     this.form.patchValue({
    //       email: res?.email,
    //       fullName: res?.fullName
    //     });
    //     this.loadedUser = res;
    //   }
    // });
    this.destroy.onDestroy(() => sub.unsubscribe());
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
    this.store.dispatch(logoutAction());
  }
}
