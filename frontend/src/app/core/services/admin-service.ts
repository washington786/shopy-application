import { inject, Injectable } from '@angular/core';
import { ApiService } from './api-service';
import { UserDto } from '../models/auth.model';
import { updateRoleRequest } from '../models/admin.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiService = inject(ApiService);
  private url = `/admin`;

  loadAllUsers() {
    return this.apiService.get<UserDto[]>(`/all-users`);
  }

  updateUserRole(request: updateRoleRequest, id: string) {
    return this.apiService.put(`${this.url}/user/${id}`, request);
  }
}
