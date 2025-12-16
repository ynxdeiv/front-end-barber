import { Injectable } from '@angular/core';
import { Service, ServiceCategory } from '../models/service';
import { apiClient } from '../config/api.config';
import { throwApiError } from '../utils/api-error.util';

export interface ServiceRequest {
  name: string;
  description?: string;
  price: number;
  duration: number;
  category: ServiceCategory;
  active: boolean;
  barbershopId?: number;
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private readonly API_PATH = '/services';

  constructor() {}

  /**
   * Obtém todos os serviços
   * @param active - Filtrar por status ativo (opcional)
   * @param category - Filtrar por categoria (opcional)
   */
  async getAllServices(active?: boolean, category?: ServiceCategory): Promise<Service[]> {
    try {
      const params: any = {};
      if (active !== undefined) {
        params.active = active.toString();
      }
      if (category) {
        params.category = category;
      }
      const response = await apiClient.get<Service[]>(this.API_PATH, { params });
      return response.data;
    } catch (error) {
      throw throwApiError(error);
    }
  }

  /**
   * Obtém apenas serviços ativos
   */
  async getActiveServices(): Promise<Service[]> {
    return this.getAllServices(true);
  }

  /**
   * Obtém serviços por categoria
   */
  async getServicesByCategory(category: ServiceCategory, activeOnly: boolean = true): Promise<Service[]> {
    return this.getAllServices(activeOnly, category);
  }

  /**
   * Busca serviço por ID
   */
  async getServiceById(id: number): Promise<Service> {
    try {
      const response = await apiClient.get<Service>(`${this.API_PATH}/${id}`);
      return response.data;
    } catch (error) {
      throw throwApiError(error);
    }
  }

  /**
   * Cria um novo serviço (requer autenticação de admin)
   */
  async createService(serviceData: ServiceRequest): Promise<Service> {
    try {
      const response = await apiClient.post<Service>(this.API_PATH, serviceData);
      return response.data;
    } catch (error) {
      throw throwApiError(error);
    }
  }

  /**
   * Atualiza um serviço existente (requer autenticação de admin)
   */
  async updateService(id: number, updates: ServiceRequest): Promise<Service> {
    try {
      const response = await apiClient.put<Service>(`${this.API_PATH}/${id}`, updates);
      return response.data;
    } catch (error) {
      throw throwApiError(error);
    }
  }

  /**
   * Remove um serviço (hard delete - remove permanentemente) (requer autenticação de admin)
   */
  async deleteService(id: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.delete<{ success: boolean; message: string }>(`${this.API_PATH}/${id}`);
      return response.data;
    } catch (error) {
      throw throwApiError(error);
    }
  }
}

