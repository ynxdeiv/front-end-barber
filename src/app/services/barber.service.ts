import { Injectable } from '@angular/core';
import { Barbeiro } from '../models/barbeiro';
import { BARBEIROS } from '../data/barbeiros';

@Injectable({
  providedIn: 'root'
})
export class BarberService {
  private readonly STORAGE_KEY = 'barber_barbeiros';
  private barbeiros: Barbeiro[] = [];

  constructor() {
    this.initializeBarbeiros();
  }

  /**
   * Inicializa barbeiros do localStorage ou usa dados mockados
   */
  private initializeBarbeiros(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        this.barbeiros = JSON.parse(stored);
      } catch {
        this.barbeiros = [...BARBEIROS];
        this.saveToStorage();
      }
    } else {
      this.barbeiros = [...BARBEIROS];
      this.saveToStorage();
    }
  }

  /**
   * Salva barbeiros no localStorage
   */
  private saveToStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.barbeiros));
  }

  /**
   * Obtém todos os barbeiros
   */
  getAllBarbeiros(): Barbeiro[] {
    return [...this.barbeiros];
  }

  /**
   * Obtém apenas barbeiros ativos
   */
  getActiveBarbeiros(): Barbeiro[] {
    return this.barbeiros.filter(b => b.active);
  }

  /**
   * Busca barbeiro por ID
   */
  getBarbeiroById(id: number): Barbeiro | undefined {
    return this.barbeiros.find(b => b.id === id);
  }

  /**
   * Cria um novo barbeiro
   */
  createBarbeiro(barbeiro: Omit<Barbeiro, 'id' | 'createdAt'>): Barbeiro {
    const newId = this.generateId();
    const newBarbeiro: Barbeiro = {
      ...barbeiro,
      id: newId,
      createdAt: new Date().toISOString()
    };
    
    this.barbeiros.push(newBarbeiro);
    this.saveToStorage();
    return newBarbeiro;
  }

  /**
   * Atualiza um barbeiro existente
   */
  updateBarbeiro(id: number, updates: Partial<Barbeiro>): boolean {
    const index = this.barbeiros.findIndex(b => b.id === id);
    if (index === -1) {
      return false;
    }
    
    this.barbeiros[index] = { ...this.barbeiros[index], ...updates };
    this.saveToStorage();
    return true;
  }

  /**
   * Remove um barbeiro (soft delete - marca como inativo)
   */
  deleteBarbeiro(id: number): boolean {
    return this.updateBarbeiro(id, { active: false });
  }

  /**
   * Gera um ID único para novo barbeiro
   */
  private generateId(): number {
    const maxId = this.barbeiros.length > 0 
      ? Math.max(...this.barbeiros.map(b => b.id))
      : 0;
    return maxId + 1;
  }
}

