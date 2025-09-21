import { inject, Injectable } from '@angular/core';
import { ApiService } from './api-service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiService = inject(ApiService);
  private authUrl = `/admin/`;

  loadAllUsers() { }

  updateUserRole() { }
}
