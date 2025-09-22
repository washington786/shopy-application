// Request:
export interface LoginRequest {
  email: string;
  password: string;
};

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
};

export interface updateProfileRequest {
  email: string,
  fullName: string
};

// Responses:
export interface UserDto {
  id: string;
  email: string;
  fullName: string;
  roles: string[];
};

export interface AuthResponse {
  token: string;
  userDto: UserDto;
};

export interface JwtPayload {
  sub: string;
  email: string;
  role: string[];
  exp: number;
  iat: number;
}
