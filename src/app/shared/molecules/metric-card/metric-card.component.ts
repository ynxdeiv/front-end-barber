import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../atoms/icon/icon.component';
import { CardComponent } from '../../atoms/card/card.component';

export type MetricTrend = 'up' | 'down' | 'neutral';

@Component({
  selector: 'app-metric-card',
  standalone: true,
  imports: [CommonModule, IconComponent, CardComponent],
  templateUrl: './metric-card.component.html',
  styleUrl: './metric-card.component.css'
})
export class MetricCardComponent {
  @Input() title: string = '';
  @Input() value: string | number = '';
  @Input() icon: string = '';
  @Input() trend?: MetricTrend;
  @Input() trendValue?: string;
  @Input() trendLabel?: string;
  @Input() color: 'primary' | 'success' | 'warning' | 'info' | 'danger' = 'primary';

  get trendIcon(): string {
    if (this.trend === 'up') return 'trending_up';
    if (this.trend === 'down') return 'trending_down';
    return 'remove';
  }

  get trendColor(): string {
    if (this.trend === 'up') return 'text-green-600 dark:text-green-400';
    if (this.trend === 'down') return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-400';
  }

  get colorClasses(): string {
    const colors = {
      primary: 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-accent',
      success: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      warning: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
      info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      danger: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
    };
    return colors[this.color];
  }

  formatValue(): string {
    if (typeof this.value === 'number') {
      // Se for um valor monetário (detectado por ser > 10 e ter decimais)
      if (this.value > 10 && this.value % 1 !== 0) {
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(this.value);
      }
      // Se for porcentagem
      if (this.value <= 100 && this.value >= 0 && this.title.toLowerCase().includes('taxa') || this.title.toLowerCase().includes('crescimento')) {
        return `${this.value.toFixed(1)}%`;
      }
      // Número inteiro
      return this.value.toLocaleString('pt-BR');
    }
    return this.value;
  }
}

