import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoadingSpinner } from "../../../shared/loading-spinner/loading-spinner";
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-user-management',
  imports: [LoadingSpinner, ReactiveFormsModule, NgFor, NgIf, MatIconModule, DatePipe],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css'
})
export class UserManagement implements OnInit {
  users = [
    {
      id: '1',
      email: 'admin@shopy.com',
      fullName: 'Admin User',
      roles: ['Admin'],
      isDeleted: false,
      createdAt: '2024-01-01T10:00:00Z'
    },
    {
      id: '2',
      email: 'manager@shopy.com',
      fullName: 'Store Manager',
      roles: ['StoreManager'],
      isDeleted: false,
      createdAt: '2024-02-15T14:30:00Z'
    },
    {
      id: '3',
      email: 'user1@shopy.com',
      fullName: 'Regular User',
      roles: ['User'],
      isDeleted: false,
      createdAt: '2024-03-20T09:15:00Z'
    },
    {
      id: '4',
      email: 'user2@shopy.com',
      fullName: 'Another User',
      roles: ['User'],
      isDeleted: true,
      createdAt: '2024-04-10T16:45:00Z'
    }
  ];

  // Available roles
  availableRoles = ['User', 'StoreManager', 'Admin'];

  // UI State
  isLoading = false;
  isModalOpen = false;
  selectedUser: any = null;

  // Form
  userForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      roles: [[], Validators.required]
    });
  }

  ngOnInit() {
    this.isLoading = true;
    // Simulate API delay
    setTimeout(() => {
      this.isLoading = false;
    }, 800);
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

    this.isLoading = true;
    // TODO: Connect to AdminService later
    console.log('User form submitted', {
      userId: this.selectedUser.id,
      ...this.userForm.value
    });

    // Simulate API delay
    setTimeout(() => {
      this.isLoading = false;
      // Update mock user
      const index = this.users.findIndex(u => u.id === this.selectedUser.id);
      if (index !== -1) {
        this.users[index] = {
          ...this.users[index],
          roles: [...this.userForm.value.roles]
        };
      }
      this.closeModal();
    }, 1000);
  }

  toggleUserStatus(user: any) {
    if (confirm(`Are you sure you want to ${user.isDeleted ? 'activate' : 'deactivate'} this user?`)) {
      // TODO: Connect to AdminService later
      console.log('Toggle user status', user.id, !user.isDeleted);
      const index = this.users.findIndex(u => u.id === user.id);
      if (index !== -1) {
        this.users[index] = {
          ...this.users[index],
          isDeleted: !user.isDeleted
        };
      }
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
