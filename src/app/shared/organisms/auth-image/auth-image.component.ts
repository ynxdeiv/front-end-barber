import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-image',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auth-image.component.html',
  styleUrl: './auth-image.component.css'
})
export class AuthImageComponent {
  @Input() imageUrl: string = '';
  @Input() imageAlt: string = '';
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() showTitle: boolean = false;
}

