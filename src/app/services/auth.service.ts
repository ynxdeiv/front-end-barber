import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { User, UserType, AdminUser, SchedulerUser } from '../models/user';
import { DEFAULT_ADMIN, DEFAULT_SCHEDULER } from '../data/users';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = 'barber_auth';
  private readonly USERS_KEY = 'barber_users';

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
    this.initializeDefaultUsers();
    this.loadStoredSession();
  }

  /**
   * Inicializa usuários padrão se não existirem
   */
  private initializeDefaultUsers(): void {
    const users = this.getAllUsers();
    
    // Adicionar admin padrão se não existir
    if (!users.some(u => u.email === DEFAULT_ADMIN.email)) {
      users.push(DEFAULT_ADMIN);
    }
    
    // Adicionar cliente padrão se não existir
    if (!users.some(u => u.email === DEFAULT_SCHEDULER.email)) {
      users.push(DEFAULT_SCHEDULER);
    }
    
    this.saveUsers(users);
  }

  /**
   * Obtém todos os usuários do sistema (para uso em agendamentos)
   */
  getAllUsersForAppointments(): User[] {
    return this.getAllUsers();
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
   * Salva sessão no localStorage
   */
  private saveSession(user: User): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    this.currentUser.set(user);
    this.isAuthenticated.set(true);
  }

  /**
   * Limpa sessão
   */
  clearSession(): void {
    localStorage.removeItem(this.STORAGE_KEY);
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
   * Login - detecta automaticamente o tipo de usuário pelo email
   */
  login(email: string, password: string): { success: boolean; message: string; user?: User } {
    const users = this.getAllUsers();
    const user = users.find(
      u => u.email === email && u.password === password
    );

    if (!user) {
      return {
        success: false,
        message: 'E-mail ou senha incorretos.'
      };
    }

    this.saveSession(user);
    return {
      success: true,
      message: `Bem-vindo, ${user.name}!`,
      user
    };
  }

  /**
   * Registro de Admin
   */
  registerAdmin(userData: Omit<AdminUser, 'id' | 'createdAt' | 'type'>): { success: boolean; message: string; user?: AdminUser } {
    const users = this.getAllUsers();
    
    // Verificar se email já existe
    if (users.some(u => u.email === userData.email)) {
      return {
        success: false,
        message: 'Este e-mail já está cadastrado.'
      };
    }

    const newId = this.generateUserId();
    const adminUser: AdminUser = {
      ...userData,
      id: newId,
      type: 'admin',
      createdAt: new Date().toISOString(),
      services: userData.services || [],
      businessHours: userData.businessHours || this.getDefaultBusinessHours()
    };

    users.push(adminUser);
    this.saveUsers(users);

    this.saveSession(adminUser);
    return {
      success: true,
      message: 'Conta de administrador criada com sucesso!',
      user: adminUser
    };
  }

  /**
   * Registro de Scheduler (Cliente)
   */
  registerScheduler(userData: Omit<SchedulerUser, 'id' | 'createdAt' | 'type' | 'preferences'>): { success: boolean; message: string; user?: SchedulerUser } {
    const users = this.getAllUsers();
    
    // Verificar se email já existe
    if (users.some(u => u.email === userData.email)) {
      return {
        success: false,
        message: 'Este e-mail já está cadastrado.'
      };
    }

    const newId = this.generateUserId();
    const schedulerUser: SchedulerUser = {
      ...userData,
      id: newId,
      type: 'scheduler',
      createdAt: new Date().toISOString(),
      preferences: {}
    };

    users.push(schedulerUser);
    this.saveUsers(users);

    this.saveSession(schedulerUser);
    return {
      success: true,
      message: 'Conta criada com sucesso!',
      user: schedulerUser
    };
  }

  /**
   * Logout
   */
  logout(): void {
    this.clearSession();
    this.router.navigate(['/']);
  }

  /**
   * Obtém todos os usuários
   */
  private getAllUsers(): User[] {
    const stored = localStorage.getItem(this.USERS_KEY);
    if (!stored) {
      return [];
    }
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  /**
   * Salva usuários
   */
  private saveUsers(users: User[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  /**
   * Gera ID único para usuário
   */
  private generateUserId(): number {
    const users = this.getAllUsers();
    const maxId = users.length > 0 
      ? Math.max(...users.map(u => u.id))
      : 0;
    return maxId + 1;
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

