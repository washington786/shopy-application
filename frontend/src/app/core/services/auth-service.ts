import { inject, Injectable } from '@angular/core';
import { ApiService } from './api-service';
import { AuthResponse, JwtPayload, LoginRequest, RegisterRequest, updateProfileRequest, UserDto } from '../models/auth.model';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiService = inject(ApiService);
  private url = `auth`;

  loginUser(request: LoginRequest) {
    return this.apiService.post<AuthResponse>(`${this.url}/login`, request);
  }

  registerUser(request: RegisterRequest) {
    return this.apiService.post<AuthResponse>(`${this.url}/register`, request);
  }

  getUserProfile() {
    return this.apiService.get<UserDto>(`${this.url}/my-profile`)
  }

  updateUserProfile(request: updateProfileRequest) {
    return this.apiService.put<UserDto>(`${this.url}/me`, request);
  }

  deactivateUserProfile(id: string) {
    return this.apiService.delete(`${this.url}/${id}`);
  }

  isAuthenticated() {
    return !!localStorage.getItem("token");
  }

  getUserRoles() {
    const token = localStorage.getItem("token");
    if (!token) return [];
    try {
      const decoded: JwtPayload = jwtDecode(token);
      if (Date.now() >= decoded.exp * 1000) {
        localStorage.removeItem("token");
        return [];
      }
      return Array.isArray(decoded.role) ? decoded.role : []
    } catch (error) {
      localStorage.removeItem("token");
      return []
    }
  }

  logout() {
    localStorage.removeItem("token");
  }
}
