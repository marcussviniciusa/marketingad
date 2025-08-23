import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    const companyId = useAuthStore.getState().selectedCompanyId;
    if (companyId) {
      config.headers['X-Company-Id'] = companyId;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Try to refresh token
      try {
        const response = await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true });
        const { accessToken } = response.data.data;
        
        useAuthStore.getState().setToken(accessToken);
        
        // Retry original request
        error.config.headers.Authorization = `Bearer ${accessToken}`;
        return api.request(error.config);
      } catch (refreshError) {
        // Refresh failed, logout user
        useAuthStore.getState().logout();
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;