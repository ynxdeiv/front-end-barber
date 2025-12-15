import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServiceService, ServiceRequest } from '../../../services/service.service';
import { Service, ServiceCategory } from '../../../models/service';

@Component({
  selector: 'app-service-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="service-management">
      <div class="header">
        <h2>Gerenciar Serviços</h2>
        <button
          class="btn btn-primary"
          (click)="openCreateModal()"
        >
          <span class="icon">➕</span>
          Adicionar Serviço
        </button>
      </div>

      <!-- Filter -->
      <div class="filters">
        <select [(ngModel)]="selectedCategory" (change)="filterServices()" class="filter-select">
          <option [value]="null">Todas as categorias</option>
          <option value="hair">Cabelo</option>
          <option value="beard">Barba</option>
          <option value="combo">Combo</option>
          <option value="other">Outros</option>
        </select>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading()" class="loading">
        <p>Carregando serviços...</p>
      </div>

      <!-- Error State -->
      <div *ngIf="error()" class="error-message">
        {{ error() }}
        <button (click)="loadServices()">Tentar novamente</button>
      </div>

      <!-- Services List -->
      <div *ngIf="!loading() && !error()" class="services-grid">
        <div
          *ngFor="let service of filteredServices()"
          class="service-card"
          [class.inactive]="!service.active"
        >
          <div class="service-image" *ngIf="service.imageUrl">
            <img [src]="service.imageUrl" [alt]="service.name" />
          </div>
          <div class="service-info">
            <h3>{{ service.name }}</h3>
            <p class="category">{{ getCategoryLabel(service.category) }}</p>
            <p class="description">{{ service.description }}</p>
            <div class="service-details">
              <span class="price">R$ {{ service.price.toFixed(2) }}</span>
              <span class="duration">⏱️ {{ service.duration }} min</span>
            </div>
            <span
              class="status-badge"
              [class.active]="service.active"
              [class.inactive]="!service.active"
            >
              {{ service.active ? 'Ativo' : 'Inativo' }}
            </span>
          </div>
          <div class="service-actions">
            <button
              class="btn btn-edit"
              (click)="openEditModal(service)"
              title="Editar"
            >
              ✏️
            </button>
            <button
              class="btn btn-delete"
              (click)="deleteService(service)"
              title="Excluir"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>

      <!-- Create/Edit Modal -->
      <div *ngIf="showModal()" class="modal-overlay" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ editingService() ? 'Editar Serviço' : 'Novo Serviço' }}</h3>
            <button class="close-btn" (click)="closeModal()">✕</button>
          </div>

          <form (ngSubmit)="saveService()" #serviceForm="ngForm">
            <div class="form-group">
              <label>Nome *</label>
              <input
                type="text"
                [(ngModel)]="formData.name"
                name="name"
                required
                class="form-control"
              />
            </div>

            <div class="form-group">
              <label>Descrição</label>
              <textarea
                [(ngModel)]="formData.description"
                name="description"
                rows="3"
                class="form-control"
              ></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Preço (R$) *</label>
                <input
                  type="number"
                  [(ngModel)]="formData.price"
                  name="price"
                  required
                  min="0"
                  step="0.01"
                  class="form-control"
                />
              </div>

              <div class="form-group">
                <label>Duração (min) *</label>
                <input
                  type="number"
                  [(ngModel)]="formData.duration"
                  name="duration"
                  required
                  min="1"
                  class="form-control"
                />
              </div>
            </div>

            <div class="form-group">
              <label>Categoria *</label>
              <select
                [(ngModel)]="formData.category"
                name="category"
                required
                class="form-control"
              >
                <option value="hair">Cabelo</option>
                <option value="beard">Barba</option>
                <option value="combo">Combo</option>
                <option value="other">Outros</option>
              </select>
            </div>

            <div class="form-group">
              <label>URL da Imagem</label>
              <input
                type="url"
                [(ngModel)]="formData.imageUrl"
                name="imageUrl"
                class="form-control"
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>

            <div class="form-group checkbox">
              <label>
                <input
                  type="checkbox"
                  [(ngModel)]="formData.active"
                  name="active"
                />
                Ativo
              </label>
            </div>

            <div class="modal-actions">
              <button
                type="button"
                class="btn btn-secondary"
                (click)="closeModal()"
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="btn btn-primary"
                [disabled]="!serviceForm.valid || saving()"
              >
                {{ saving() ? 'Salvando...' : 'Salvar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .service-management {
      padding: 20px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .header h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }

    .filters {
      margin-bottom: 20px;
    }

    .filter-select {
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    .loading, .error-message {
      text-align: center;
      padding: 40px;
      font-size: 18px;
    }

    .error-message {
      color: #dc3545;
    }

    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 20px;
    }

    .service-card {
      background: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: transform 0.2s;
    }

    .service-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }

    .service-card.inactive {
      opacity: 0.6;
    }

    .service-image {
      width: 100%;
      height: 180px;
      overflow: hidden;
    }

    .service-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .service-info {
      padding: 16px;
    }

    .service-info h3 {
      margin: 0 0 4px 0;
      font-size: 18px;
      font-weight: 600;
    }

    .category {
      color: #6c757d;
      font-size: 12px;
      text-transform: uppercase;
      font-weight: 600;
      margin: 0 0 8px 0;
    }

    .description {
      color: #495057;
      font-size: 14px;
      margin: 0 0 12px 0;
      line-height: 1.4;
    }

    .service-details {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 12px 0;
    }

    .price {
      font-size: 20px;
      font-weight: 700;
      color: #28a745;
    }

    .duration {
      font-size: 14px;
      color: #6c757d;
    }

    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }

    .status-badge.active {
      background: #d4edda;
      color: #155724;
    }

    .status-badge.inactive {
      background: #f8d7da;
      color: #721c24;
    }

    .service-actions {
      display: flex;
      gap: 10px;
      padding: 12px 16px;
      border-top: 1px solid #f0f0f0;
      justify-content: flex-end;
    }

    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-primary {
      background: #007bff;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #0056b3;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background: #5a6268;
    }

    .btn-edit {
      background: #ffc107;
      padding: 6px 12px;
    }

    .btn-edit:hover {
      background: #e0a800;
    }

    .btn-delete {
      background: #dc3545;
      color: white;
      padding: 6px 12px;
    }

    .btn-delete:hover {
      background: #c82333;
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 8px;
      padding: 24px;
      max-width: 500px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .modal-header h3 {
      margin: 0;
      font-size: 20px;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #6c757d;
    }

    .close-btn:hover {
      color: #000;
    }

    .form-group {
      margin-bottom: 16px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .form-group label {
      display: block;
      margin-bottom: 4px;
      font-weight: 500;
    }

    .form-control {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    .form-control:focus {
      outline: none;
      border-color: #007bff;
    }

    textarea.form-control {
      resize: vertical;
    }

    .form-group.checkbox label {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .modal-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
      margin-top: 24px;
    }
  `]
})
export class ServiceManagementComponent implements OnInit {
  services = signal<Service[]>([]);
  filteredServices = signal<Service[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  showModal = signal(false);
  editingService = signal<Service | null>(null);
  saving = signal(false);
  selectedCategory: ServiceCategory | null = null;

  formData: ServiceRequest = {
    name: '',
    description: '',
    price: 0,
    duration: 30,
    category: 'hair',
    active: true,
    imageUrl: ''
  };

  constructor(private serviceService: ServiceService) {}

  ngOnInit() {
    this.loadServices();
  }

  async loadServices() {
    this.loading.set(true);
    this.error.set(null);

    try {
      const services = await this.serviceService.getAllServices();
      this.services.set(services);
      this.filterServices();
    } catch (err: any) {
      console.error('Error loading services:', err);
      this.error.set(err.message || 'Erro ao carregar serviços');
    } finally {
      this.loading.set(false);
    }
  }

  filterServices() {
    const allServices = this.services();
    if (this.selectedCategory) {
      this.filteredServices.set(
        allServices.filter(s => s.category === this.selectedCategory)
      );
    } else {
      this.filteredServices.set(allServices);
    }
  }

  getCategoryLabel(category: ServiceCategory): string {
    const labels: Record<ServiceCategory, string> = {
      hair: 'Cabelo',
      beard: 'Barba',
      combo: 'Combo',
      other: 'Outros'
    };
    return labels[category];
  }

  openCreateModal() {
    this.editingService.set(null);
    this.formData = {
      name: '',
      description: '',
      price: 0,
      duration: 30,
      category: 'hair',
      active: true,
      imageUrl: ''
    };
    this.showModal.set(true);
  }

  openEditModal(service: Service) {
    this.editingService.set(service);
    this.formData = {
      name: service.name,
      description: service.description || '',
      price: service.price,
      duration: service.duration,
      category: service.category,
      active: service.active,
      imageUrl: service.imageUrl || ''
    };
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.editingService.set(null);
  }

  async saveService() {
    this.saving.set(true);

    try {
      const editing = this.editingService();
      if (editing) {
        await this.serviceService.updateService(editing.id, this.formData);
      } else {
        await this.serviceService.createService(this.formData);
      }

      this.closeModal();
      await this.loadServices();
    } catch (err: any) {
      console.error('Error saving service:', err);
      alert(err.message || 'Erro ao salvar serviço');
    } finally {
      this.saving.set(false);
    }
  }

  async deleteService(service: Service) {
    if (!confirm(`Deseja realmente excluir o serviço ${service.name}?`)) {
      return;
    }

    try {
      await this.serviceService.deleteService(service.id);
      await this.loadServices();
    } catch (err: any) {
      console.error('Error deleting service:', err);
      alert(err.message || 'Erro ao excluir serviço');
    }
  }
}

