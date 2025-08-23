import api from './api';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'superadmin' | 'admin' | 'user';
  isActive: boolean;
  emailVerified: boolean;
  profileImage?: string;
  companies?: Company[];
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  plan: 'free' | 'starter' | 'professional' | 'enterprise';
}

export interface LoginResponse {
  success: boolean;
  data: {
    user: User;
    accessToken: string;
  };
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  companyName: string;
}

export interface RegisterResponse {
  success: boolean;
  data: {
    user: User;
    company: Company;
    accessToken: string;
  };
}

class AuthService {
  async login(email: string, password: string): Promise<LoginResponse['data']> {
    const response = await api.post<LoginResponse>('/auth/login', { email, password });
    return response.data.data;
  }

  async register(data: RegisterData): Promise<RegisterResponse['data']> {
    const response = await api.post<RegisterResponse>('/auth/register', data);
    return response.data.data;
  }

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  }

  async me(): Promise<User> {
    const response = await api.get('/auth/me');
    return response.data.data.user;
  }

  async forgotPassword(email: string): Promise<void> {
    await api.post('/auth/forgot-password', { email });
  }

  async resetPassword(token: string, password: string): Promise<void> {
    await api.post('/auth/reset-password', { token, password });
  }

  async refreshToken(): Promise<string> {
    const response = await api.post('/auth/refresh');
    return response.data.data.accessToken;
  }
}

export const authService = new AuthService();