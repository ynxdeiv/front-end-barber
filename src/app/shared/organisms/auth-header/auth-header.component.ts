import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../atoms/icon/icon.component';

@Component({
  selector: 'app-auth-header',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './auth-header.component.html',
  styleUrl: './auth-header.component.css'
})
export class AuthHeaderComponent {
  @Input() title: string = 'Barber Agenda';
  @Input() subtitle: string = '';
}

