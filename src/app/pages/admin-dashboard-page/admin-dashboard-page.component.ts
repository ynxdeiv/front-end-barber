import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardTemplateComponent } from '../../shared/templates/dashboard-template/dashboard-template.component';
import { MetricsDashboardComponent } from '../../shared/organisms/metrics-dashboard/metrics-dashboard.component';
import { TodayAppointmentsListComponent } from '../../shared/organisms/today-appointments-list/today-appointments-list.component';
import { FinancialSummaryComponent } from '../../shared/organisms/financial-summary/financial-summary.component';
import { AuthService } from '../../services/auth.service';
import { MetricsCalculationService, DashboardMetrics } from '../../services/metrics-calculation.service';
import { Appointment } from '../../models/appointment';
import { IconComponent } from '../../shared/atoms/icon/icon.component';
import { CardComponent } from '../../shared/atoms/card/card.component';

@Component({
  selector: 'app-admin-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    DashboardTemplateComponent,
    MetricsDashboardComponent,
    TodayAppointmentsListComponent,
    FinancialSummaryComponent,
    IconComponent,
    CardComponent
  ],
  templateUrl: './admin-dashboard-page.component.html',
  styleUrl: './admin-dashboard-page.component.css'
})
export class AdminDashboardPageComponent implements OnInit {
  metrics = signal<DashboardMetrics | null>(null);
  todayAppointments = signal<Appointment[]>([]);
  isLoading = signal(true);

  constructor(
    public authService: AuthService,
    private metricsService: MetricsCalculationService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading.set(true);
    
    // Simular um pequeno delay para melhor UX
    setTimeout(() => {
      const metrics = this.metricsService.calculateMetrics();
      const todayAppointments = this.metricsService.getTodayAppointments();
      
      this.metrics.set(metrics);
      this.todayAppointments.set(todayAppointments);
      this.isLoading.set(false);
    }, 300);
  }

  get adminUser() {
    const user = this.authService.getCurrentUser();
    return user && user.type === 'admin' ? user : null;
  }

  refreshDashboard(): void {
    this.loadDashboardData();
  }
}
