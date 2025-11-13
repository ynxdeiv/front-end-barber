import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../atoms/icon/icon.component';

@Component({
  selector: 'app-feature-highlight',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './feature-highlight.component.html',
  styleUrl: './feature-highlight.component.css'
})
export class FeatureHighlightComponent {
  @Input() icon: string = 'check_circle';
  @Input() title: string = '';
  @Input() description: string = '';
}

