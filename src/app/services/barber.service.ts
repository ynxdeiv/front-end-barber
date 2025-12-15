import { Injectable } from '@angular/core';
import { Barbeiro } from '../models/barbeiro';
import { apiClient } from '../config/api.config';
import { handleApiError } from '../utils/api-error.util';

export interface BarberRequest {
  name: string;
  email: string;
  phone: string;
  specialty: string;
  active: boolean;
  commissionPercentage: number;
}

@Injectable({
  providedIn: 'root'
})
export class BarberService {
  private readonly API_PATH = '/barbers';

  constructor() {}

  /**
   * Obtém todos os barbeiros
   * @param active - Filtrar por status ativo (opcional)
   */
  async getAllBarbeiros(active?: boolean): Promise<Barbeiro[]> {
    try {
      const params = active !== undefined ? { active: active.toString() } : {};
      const response = await apiClient.get<Barbeiro[]>(this.API_PATH, { params });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Obtém apenas barbeiros ativos
   */
  async getActiveBarbeiros(): Promise<Barbeiro[]> {
    return this.getAllBarbeiros(true);
  }

  /**
   * Busca barbeiro por ID
   */
  async getBarbeiroById(id: number): Promise<Barbeiro> {
    try {
      const response = await apiClient.get<Barbeiro>(`${this.API_PATH}/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Cria um novo barbeiro (requer autenticação de admin)
   */
  async createBarbeiro(barberData: BarberRequest): Promise<Barbeiro> {
    try {
      const response = await apiClient.post<Barbeiro>(this.API_PATH, barberData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Atualiza um barbeiro existente (requer autenticação de admin)
   */
  async updateBarbeiro(id: number, updates: BarberRequest): Promise<Barbeiro> {
    try {
      const response = await apiClient.put<Barbeiro>(`${this.API_PATH}/${id}`, updates);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Remove um barbeiro (soft delete - marca como inativo) (requer autenticação de admin)
   */
  async deleteBarbeiro(id: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.delete<{ success: boolean; message: string }>(`${this.API_PATH}/${id}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

