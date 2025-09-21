import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private authUrl = `${environment.apiUrl}/auth/`;

  loginUser() { }

  registerUser() { }

  getUserProfile() { }

  updateUserProfile() { }

  deactivateUserProfile() { }
}
