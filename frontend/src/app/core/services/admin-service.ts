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

  loadAllUsers(page: number = 1, pageSize: number = 10) {
    return this.apiService.get<UserDto[]>(`${this.url}/all-users?page=${page}&pageSize=${pageSize}`);
  }

  updateUserRole(request: updateRoleRequest, id: string) {
    return this.apiService.put(`${this.url}/user/${id}`, request);
  }
}
