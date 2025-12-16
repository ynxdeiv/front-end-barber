import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-work-gallery-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './work-gallery-item.component.html',
  styleUrl: './work-gallery-item.component.css'
})
export class WorkGalleryItemComponent {
  @Input() imageUrl: string = '';
  @Input() imageAlt: string = '';
  @Input() title?: string;
  @Input() description?: string;
}

