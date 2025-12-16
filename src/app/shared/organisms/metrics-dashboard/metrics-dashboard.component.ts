import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardMetrics } from '../../../services/metrics-calculation.service';
import { MetricCardComponent } from '../../molecules/metric-card/metric-card.component';

@Component({
  selector: 'app-metrics-dashboard',
  standalone: true,
  imports: [CommonModule, MetricCardComponent],
  templateUrl: './metrics-dashboard.component.html',
  styleUrl: './metrics-dashboard.component.css'
})
export class MetricsDashboardComponent {
  @Input() metrics!: DashboardMetrics;

  get revenueTrend(): 'up' | 'down' | 'neutral' {
    if (this.metrics.revenueGrowth > 0) return 'up';
    if (this.metrics.revenueGrowth < 0) return 'down';
    return 'neutral';
  }

  get revenueTrendValue(): string {
    const value = Math.abs(this.metrics.revenueGrowth);
    return `${value.toFixed(1)}%`;
  }
}

