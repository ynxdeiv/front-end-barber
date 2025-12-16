import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BarberService, BarberRequest } from '../../../services/barber.service';
import { Barbeiro } from '../../../models/barbeiro';

@Component({
  selector: 'app-barber-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="barber-management">
      <div class="header">
        <h2>Gerenciar Barbeiros</h2>
        <button
          class="btn btn-primary"
          (click)="openCreateModal()"
        >
          <span class="icon">➕</span>
          Adicionar Barbeiro
        </button>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading()" class="loading">
        <p>Carregando barbeiros...</p>
      </div>

      <!-- Error State -->
      <div *ngIf="error()" class="error-message">
        {{ error() }}
        <button (click)="loadBarbers()">Tentar novamente</button>
      </div>

      <!-- Barbers List -->
      <div *ngIf="!loading() && !error()" class="barbers-grid">
        <div
          *ngFor="let barber of barbers()"
          class="barber-card"
          [class.inactive]="!barber.active"
        >
          <div class="barber-info">
            <h3>{{ barber.name }}</h3>
            <p class="specialty">{{ barber.specialty }}</p>
            <p class="contact">📧 {{ barber.email }}</p>
            <p class="contact">📱 {{ barber.phone }}</p>
            <p class="commission">Comissão: {{ barber.commissionPercentage }}%</p>
            <span
              class="status-badge"
              [class.active]="barber.active"
              [class.inactive]="!barber.active"
            >
              {{ barber.active ? 'Ativo' : 'Inativo' }}
            </span>
          </div>
          <div class="barber-actions">
            <button
              class="btn btn-edit"
              (click)="openEditModal(barber)"
              title="Editar"
            >
              ✏️
            </button>
            <button
              class="btn btn-delete"
              (click)="deleteBarber(barber)"
              [disabled]="!barber.active"
              title="Desativar"
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
            <h3>{{ editingBarber() ? 'Editar Barbeiro' : 'Novo Barbeiro' }}</h3>
            <button class="close-btn" (click)="closeModal()">✕</button>
          </div>

          <form (ngSubmit)="saveBarber()" #barberForm="ngForm">
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
              <label>Email *</label>
              <input
                type="email"
                [(ngModel)]="formData.email"
                name="email"
                required
                class="form-control"
              />
            </div>

            <div class="form-group">
              <label>Telefone *</label>
              <input
                type="tel"
                [(ngModel)]="formData.phone"
                name="phone"
                required
                class="form-control"
              />
            </div>

            <div class="form-group">
              <label>Especialidade *</label>
              <input
                type="text"
                [(ngModel)]="formData.specialty"
                name="specialty"
                required
                class="form-control"
                placeholder="Ex: Corte Clássico, Barba, etc."
              />
            </div>

            <div class="form-group">
              <label>Comissão (%) *</label>
              <input
                type="number"
                [(ngModel)]="formData.commissionPercentage"
                name="commissionPercentage"
                required
                min="0"
                max="100"
                class="form-control"
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
                [disabled]="!barberForm.valid || saving()"
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
    .barber-management {
      padding: 20px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }

    .header h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }

    .loading, .error-message {
      text-align: center;
      padding: 40px;
      font-size: 18px;
    }

    .error-message {
      color: #dc3545;
    }

    .barbers-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }

    .barber-card {
      background: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: transform 0.2s;
    }

    .barber-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }

    .barber-card.inactive {
      opacity: 0.6;
      background: #f8f9fa;
    }

    .barber-info h3 {
      margin: 0 0 8px 0;
      font-size: 18px;
      font-weight: 600;
    }

    .specialty {
      color: #6c757d;
      font-style: italic;
      margin: 0 0 12px 0;
    }

    .contact {
      margin: 4px 0;
      font-size: 14px;
    }

    .commission {
      margin: 8px 0;
      font-weight: 500;
      color: #28a745;
    }

    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      margin-top: 8px;
    }

    .status-badge.active {
      background: #d4edda;
      color: #155724;
    }

    .status-badge.inactive {
      background: #f8d7da;
      color: #721c24;
    }

    .barber-actions {
      display: flex;
      gap: 10px;
      margin-top: 16px;
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

    .btn-delete:hover:not(:disabled) {
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
export class BarberManagementComponent implements OnInit {
  barbers = signal<Barbeiro[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  showModal = signal(false);
  editingBarber = signal<Barbeiro | null>(null);
  saving = signal(false);

  formData: BarberRequest = {
    name: '',
    email: '',
    phone: '',
    specialty: '',
    active: true,
    commissionPercentage: 50
  };

  constructor(private barberService: BarberService) {}

  ngOnInit() {
    this.loadBarbers();
  }

  async loadBarbers() {
    this.loading.set(true);
    this.error.set(null);

    try {
      const barbers = await this.barberService.getAllBarbeiros();
      this.barbers.set(barbers);
    } catch (err: any) {
      console.error('Error loading barbers:', err);
      this.error.set(err.message || 'Erro ao carregar barbeiros');
    } finally {
      this.loading.set(false);
    }
  }

  openCreateModal() {
    this.editingBarber.set(null);
    this.formData = {
      name: '',
      email: '',
      phone: '',
      specialty: '',
      active: true,
      commissionPercentage: 50
    };
    this.showModal.set(true);
  }

  openEditModal(barber: Barbeiro) {
    this.editingBarber.set(barber);
    this.formData = {
      name: barber.name,
      email: barber.email,
      phone: barber.phone,
      specialty: barber.specialty || '',
      active: barber.active,
      commissionPercentage: barber.commissionPercentage
    };
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.editingBarber.set(null);
  }

  async saveBarber() {
    this.saving.set(true);

    try {
      const editing = this.editingBarber();
      if (editing) {
        await this.barberService.updateBarbeiro(editing.id, this.formData);
      } else {
        await this.barberService.createBarbeiro(this.formData);
      }

      this.closeModal();
      await this.loadBarbers();
    } catch (err: any) {
      console.error('Error saving barber:', err);
      alert(err.message || 'Erro ao salvar barbeiro');
    } finally {
      this.saving.set(false);
    }
  }

  async deleteBarber(barber: Barbeiro) {
    if (!confirm(`Deseja realmente desativar o barbeiro ${barber.name}?`)) {
      return;
    }

    try {
      await this.barberService.deleteBarbeiro(barber.id);
      await this.loadBarbers();
    } catch (err: any) {
      console.error('Error deleting barber:', err);
      alert(err.message || 'Erro ao desativar barbeiro');
    }
  }
}

