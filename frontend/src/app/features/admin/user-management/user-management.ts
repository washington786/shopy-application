import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoadingSpinner } from "../../../shared/loading-spinner/loading-spinner";
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth-service';
import { UserDto } from '../../../core/models/auth.model';
import { AdminService } from '../../../core/services/admin-service';

@Component({
  selector: 'app-user-management',
  imports: [LoadingSpinner, ReactiveFormsModule, MatIconModule, DatePipe],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css'
})
export class UserManagement implements OnInit {

  service = inject(AdminService);
  users = signal<UserDto[] | null>(null);

  // Available roles
  availableRoles = ['User', 'StoreManager', 'Admin'];

  // UI State
  isLoading = signal(false);
  error: string | null = null;
  isModalOpen = false;
  selectedUser: UserDto | null = null;

  // Form
  userForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      roles: [[], Validators.required]
    });
  }

  ngOnInit() {
    this.isLoading.set(true);
    this.service.loadAllUsers().subscribe({
      next: users => {
        console.log('users: ', users);

        this.users.set(users);
        this.isLoading.set(false);
      }, error: error => {
        this.error = error;
        this.users.set(null);
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }

  openEditModal(user: any) {
    this.selectedUser = { ...user };
    this.userForm.patchValue({
      roles: [...user.roles]
    });
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  onSubmit() {
    if (this.userForm.invalid) {
      this.markFormGroupTouched(this.userForm);
      return;
    }

    this.isLoading.set(true);
    // Simulate API delay
    setTimeout(() => {
      this.isLoading.set(false);
      // Update mock user
      this.users.update(users => {
        if (!users) return users;
        return users.map(user => user.id === this.selectedUser?.id ? { ...user, roles: [this.userForm.value?.roles] } : user);
      })
      this.closeModal();
    }, 1000);
  }

  toggleUserStatus(user: any) {
    if (confirm(`Are you sure you want to ${user.isDeleted ? 'activate' : 'deactivate'} this user?`)) {
      this.users.update(users => {
        if (!users) return users;
        return users.map(user => user.id === this.selectedUser?.id ? { ...user, isDeleted: !user.isActive } : user);
      });
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  isRoleSelected(role: string): boolean {
    return this.userForm.get('roles')?.value?.includes(role) || false;
  }

  toggleRole(role: string) {
    const currentRoles = this.userForm.get('roles')?.value || [];
    const newRoles = currentRoles.includes(role)
      ? currentRoles.filter((r: any) => r !== role)
      : [...currentRoles, role];
    this.userForm.patchValue({ roles: newRoles });
  }
}
