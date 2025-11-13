import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkGalleryItemComponent } from '../../molecules/work-gallery-item/work-gallery-item.component';

export interface GalleryItem {
  imageUrl: string;
  imageAlt: string;
  title?: string;
  description?: string;
}

@Component({
  selector: 'app-gallery-preview',
  standalone: true,
  imports: [CommonModule, WorkGalleryItemComponent],
  templateUrl: './gallery-preview.component.html',
  styleUrl: './gallery-preview.component.css'
})
export class GalleryPreviewComponent {
  @Input() items: GalleryItem[] = [];
  @Input() title: string = 'Nossos Trabalhos';
  @Input() subtitle: string = 'Veja alguns dos nossos trabalhos';
  @Input() maxItems: number = 6; // Limitar quantidade exibida
}

