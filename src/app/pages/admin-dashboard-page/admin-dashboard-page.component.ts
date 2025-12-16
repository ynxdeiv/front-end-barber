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

@Component({
  selector: 'app-admin-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    DashboardTemplateComponent,
    MetricsDashboardComponent,
    TodayAppointmentsListComponent,
    FinancialSummaryComponent,
    IconComponent
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

  async loadDashboardData(): Promise<void> {
    this.isLoading.set(true);

    try {
      // Simular um pequeno delay para melhor UX
      await new Promise(resolve => setTimeout(resolve, 300));

      const metrics = await this.metricsService.calculateMetrics();
      const todayAppointments = await this.metricsService.getTodayAppointments();

      this.metrics.set(metrics);
      this.todayAppointments.set(todayAppointments);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  get adminUser() {
    const user = this.authService.getCurrentUser();
    return user && user.type === 'admin' ? user : null;
  }

  refreshDashboard(): void {
    this.loadDashboardData();
  }
}
