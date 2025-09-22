import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field'
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, MatInputModule, MatFormFieldModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {

  formBuilder = inject(FormBuilder);
  form!: FormGroup;

  router = inject(Router);

  isLoading: boolean = false;
  error: string | null = null;

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (!this.form.valid) return;
    this.router.navigate(["/"])
  }

  goToRegister() {
    this.router.navigate(["/auth/register"]);
  }
}
