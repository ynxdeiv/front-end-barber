import axios, { AxiosInstance } from 'axios';
import { environment } from '../../environments/environment';

/**
 * API Configuration
 * Base URL for the backend API
 */
export const API_CONFIG = {
  baseURL: environment.apiUrl,
  timeout: environment.apiTimeout,
};

/**
 * Axios instance configured with base URL and interceptors
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor to add JWT token to all requests
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('barber_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor to handle common errors
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('barber_auth_token');
      localStorage.removeItem('barber_auth');
      // You can trigger a redirect here or emit an event
    }
    return Promise.reject(error);
  }
);

