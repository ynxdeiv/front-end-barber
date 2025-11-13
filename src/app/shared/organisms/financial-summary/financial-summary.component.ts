import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardMetrics } from '../../../services/metrics-calculation.service';
import { CardComponent } from '../../atoms/card/card.component';
import { IconComponent } from '../../atoms/icon/icon.component';
import { PriceTagComponent } from '../../atoms/price-tag/price-tag.component';

@Component({
  selector: 'app-financial-summary',
  standalone: true,
  imports: [CommonModule, CardComponent, IconComponent, PriceTagComponent],
  templateUrl: './financial-summary.component.html',
  styleUrl: './financial-summary.component.css'
})
export class FinancialSummaryComponent {
  @Input() metrics!: DashboardMetrics;

  getRevenueGrowthAbs(): string {
    return Math.abs(this.metrics.revenueGrowth).toFixed(1);
  }

  get revenueGrowthColor(): string {
    if (this.metrics.revenueGrowth > 0) return 'text-green-600 dark:text-green-400';
    if (this.metrics.revenueGrowth < 0) return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-400';
  }

  get revenueGrowthIcon(): string {
    if (this.metrics.revenueGrowth > 0) return 'trending_up';
    if (this.metrics.revenueGrowth < 0) return 'trending_down';
    return 'remove';
  }
}

