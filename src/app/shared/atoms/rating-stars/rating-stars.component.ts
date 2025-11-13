import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-rating-stars',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './rating-stars.component.html',
  styleUrl: './rating-stars.component.css'
})
export class RatingStarsComponent {
  @Input() rating: number = 0; // 0 a 5
  @Input() maxRating: number = 5;
  @Input() showNumber: boolean = false;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  get stars(): number[] {
    return Array.from({ length: this.maxRating }, (_, i) => i + 1);
  }

  isFilled(starIndex: number): boolean {
    return starIndex <= Math.round(this.rating);
  }
}

