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
    return this.apiService.get<UserDto>(`${this.url}/my-profile`)
  }

  updateUserProfile(request: updateProfileRequest) {
    return this.apiService.put<UserDto>(`${this.url}/me`, request);
  }

  deactivateUserProfile(id: string) {
    return this.apiService.delete(`${this.url}/${id}`);
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
