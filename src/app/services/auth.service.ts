import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import {
  User,
  UserType,
  AdminUser,
  SchedulerUser,
  RegisterAdminRequest,
  RegisterSchedulerRequest,
  LoginRequest,
  AuthResponse,
  UserResponse
} from '../models/user';
import { apiClient } from '../config/api.config';
import { getErrorMessage, logError } from '../utils/api-error.util';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = 'barber_auth';
  private readonly TOKEN_KEY = 'barber_auth_token';

  // Estado reativo
  private currentUser = signal<User | null>(null);
  private isAuthenticated = signal<boolean>(false);

  // Computed signals
  userType = computed(() => {
    const user = this.currentUser();
    return user?.type || null;
  });

  isAdmin = computed(() => this.userType() === 'admin');
  isScheduler = computed(() => this.userType() === 'scheduler');

  constructor(private router: Router) {
    this.loadStoredSession();
    this.initializeUserFromToken();
  }

  /**
   * Initialize user from stored token by calling /api/auth/me
   */
  private async initializeUserFromToken(): Promise<void> {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (token && !this.currentUser()) {
      try {
        await this.getCurrentUserProfile();
      } catch (error) {
        console.error('Failed to load user profile:', error);
        this.clearSession();
      }
    }
  }

  /**
   * Get all users from backend API (for use in appointments)
   */
  async getAllUsersForAppointments(): Promise<User[]> {
    try {
      const response = await apiClient.get<UserResponse[]>('/users');
      return response.data.map(this.mapUserResponseToUser);
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }

  /**
   * Map UserResponse to User type
   */
  private mapUserResponseToUser(userResponse: UserResponse): User {
    if (userResponse.type === 'admin') {
      return {
        id: userResponse.id,
        email: userResponse.email,
        name: userResponse.name,
        phone: userResponse.phone,
        type: 'admin',
        barbershopName: userResponse.barbershopName || '',
        address: userResponse.address || '',
        createdAt: userResponse.createdAt,
        services: [],
        businessHours: this.getDefaultBusinessHours()
      } as AdminUser;
    } else {
      return {
        id: userResponse.id,
        email: userResponse.email,
        name: userResponse.name,
        phone: userResponse.phone,
        type: 'scheduler',
        createdAt: userResponse.createdAt,
        preferences: {}
      } as SchedulerUser;
    }
  }

  /**
   * Carrega sessão do localStorage
   */
  private loadStoredSession(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const user = JSON.parse(stored);
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
      } catch {
        this.clearSession();
      }
    }
  }

  /**
   * Save session with token and user data
   */
  private saveSession(user: User, token: string): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    localStorage.setItem(this.TOKEN_KEY, token);
    this.currentUser.set(user);
    this.isAuthenticated.set(true);
  }

  /**
   * Clear session
   */
  clearSession(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
  }

  /**
   * Obtém usuário atual
   */
  getCurrentUser(): User | null {
    return this.currentUser();
  }

  /**
   * Verifica se está autenticado
   */
  checkAuth(): boolean {
    return this.isAuthenticated();
  }

  /**
   * Login with backend API
   */
  async login(email: string, password: string): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      const loginRequest: LoginRequest = { email, password };
      const response = await apiClient.post<AuthResponse>('/auth/login', loginRequest);

      if (response.data.success && response.data.token && response.data.user) {
        const user = this.mapUserResponseToUser(response.data.user as UserResponse);
        this.saveSession(user, response.data.token);

        return {
          success: true,
          message: response.data.message,
          user
        };
      }

      return {
        success: false,
        message: response.data.message || 'Login failed'
      };
    } catch (error: any) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || 'E-mail ou senha incorretos.';
      return {
        success: false,
        message
      };
    }
  }

  /**
   * Register Admin with backend API
   */
  async registerAdmin(userData: Omit<AdminUser, 'id' | 'createdAt' | 'type' | 'services' | 'businessHours'>): Promise<{ success: boolean; message: string; user?: AdminUser }> {
    try {
      const registerRequest: RegisterAdminRequest = {
        email: userData.email,
        password: userData.password || '',
        name: userData.name,
        phone: userData.phone,
        barbershopName: userData.barbershopName,
        address: userData.address
      };

      const response = await apiClient.post<AuthResponse>('/auth/register/admin', registerRequest);

      if (response.data.success && response.data.user) {
        const adminUser = this.mapUserResponseToUser(response.data.user as UserResponse) as AdminUser;

        // If token is provided, save session (auto-login after registration)
        if (response.data.token) {
          this.saveSession(adminUser, response.data.token);
        }

        return {
          success: true,
          message: response.data.message,
          user: adminUser
        };
      }

      return {
        success: false,
        message: response.data.message || 'Registration failed'
      };
    } catch (error: any) {
      console.error('Admin registration error:', error);
      const message = error.response?.data?.message || 'Erro ao criar conta de administrador.';
      return {
        success: false,
        message
      };
    }
  }

  /**
   * Register Scheduler with backend API
   */
  async registerScheduler(userData: Omit<SchedulerUser, 'id' | 'createdAt' | 'type' | 'preferences'>): Promise<{ success: boolean; message: string; user?: SchedulerUser }> {
    try {
      const registerRequest: RegisterSchedulerRequest = {
        email: userData.email,
        password: userData.password || '',
        name: userData.name,
        phone: userData.phone
      };

      const response = await apiClient.post<AuthResponse>('/auth/register/scheduler', registerRequest);

      if (response.data.success && response.data.user) {
        const schedulerUser = this.mapUserResponseToUser(response.data.user as UserResponse) as SchedulerUser;

        // If token is provided, save session (auto-login after registration)
        if (response.data.token) {
          this.saveSession(schedulerUser, response.data.token);
        }

        return {
          success: true,
          message: response.data.message,
          user: schedulerUser
        };
      }

      return {
        success: false,
        message: response.data.message || 'Registration failed'
      };
    } catch (error: any) {
      console.error('Scheduler registration error:', error);
      const message = error.response?.data?.message || 'Erro ao criar conta.';
      return {
        success: false,
        message
      };
    }
  }

  /**
   * Logout with backend API
   */
  async logout(): Promise<void> {
    try {
      // Call backend logout endpoint
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local session regardless of API call result
      this.clearSession();
      this.router.navigate(['/']);
    }
  }

  /**
   * Get current user profile from backend API
   */
  async getCurrentUserProfile(): Promise<User | null> {
    try {
      const response = await apiClient.get<UserResponse>('/auth/me');
      const user = this.mapUserResponseToUser(response.data);
      this.currentUser.set(user);
      this.isAuthenticated.set(true);
      return user;
    } catch (error) {
      console.error('Error fetching current user:', error);
      this.clearSession();
      return null;
    }
  }

  /**
   * Get all users (requires authentication)
   */
  async getAllUsers(): Promise<User[]> {
    try {
      const response = await apiClient.get<UserResponse[]>('/users');
      return response.data.map(this.mapUserResponseToUser);
    } catch (error) {
      console.error('Error fetching all users:', error);
      return [];
    }
  }


  /**
   * Horários padrão de funcionamento
   */
  private getDefaultBusinessHours() {
    return {
      monday: { open: '09:00', close: '18:00', closed: false },
      tuesday: { open: '09:00', close: '18:00', closed: false },
      wednesday: { open: '09:00', close: '18:00', closed: false },
      thursday: { open: '09:00', close: '18:00', closed: false },
      friday: { open: '09:00', close: '18:00', closed: false },
      saturday: { open: '09:00', close: '18:00', closed: false },
      sunday: { open: '09:00', close: '18:00', closed: true }
    };
  }
}

