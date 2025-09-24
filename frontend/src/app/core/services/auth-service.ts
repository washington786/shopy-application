import { inject, Injectable } from '@angular/core';
import { ApiService } from './api-service';
import { AuthResponse, JwtPayload, LoginRequest, RegisterRequest, updateProfileRequest, UserDto } from '../models/auth.model';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiService = inject(ApiService);
  token: string = "token";

  private url = `auth`;

  loginUser(request: LoginRequest) {
    return this.apiService.post<AuthResponse>(`${this.url}/login`, request);
  }

  registerUser(request: RegisterRequest) {
    return this.apiService.post<AuthResponse>(`${this.url}/register`, request);
  }

  getUserProfile() {
    return this.apiService.get<UserDto>(`/${this.url}/my-profile`)
  }

  updateUserProfile(request: updateProfileRequest) {
    return this.apiService.put<UserDto>(`/${this.url}/me`, request);
  }

  deactivateUserProfile(id: string) {
    return this.apiService.delete(`${this.url}/${id}`);
  }

  getUserRoles(): string[] {
    const token = localStorage.getItem("token");
    if (!token) return [];

    try {
      const decoded: any = jwtDecode(token);

      // 👇 Use the FULL claim name from your JWT
      const roleClaim = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
      const role = decoded[roleClaim];

      if (!role) return [];

      // Handle both string and array
      if (Array.isArray(role)) return role;
      if (typeof role === 'string') return [role];

      return [];
    } catch (error) {
      localStorage.removeItem("token");
      return [];
    }
  }

  getToken() {
    const tok = localStorage.getItem(this.token);
    return tok ? tok : '';
  }

  logout() {
    localStorage.removeItem(this.token);
  }

  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;

    if (this.isTokenExpired()) {
      this.logout();
      return false;
    }
    return true;
  }

  isTokenExpired() {
    const token = this.getToken();

    if (!token) return true;

    try {
      const decoded: any = jwtDecode(token);

      if (!decoded.exp) return true;

      return Date.now() > decoded.exp! * 1000;

    } catch (error) {
      console.log(error);
      return true;
    }
  }

}
