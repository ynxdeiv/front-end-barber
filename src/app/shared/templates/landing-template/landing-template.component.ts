import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IconComponent } from '../../atoms/icon/icon.component';
import { ButtonComponent } from '../../atoms/button/button.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-landing-template',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent, ButtonComponent],
  templateUrl: './landing-template.component.html',
  styleUrl: './landing-template.component.css'
})
export class LandingTemplateComponent {
  currentYear = new Date().getFullYear();

  constructor(public authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}

