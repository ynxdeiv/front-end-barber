import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-template',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auth-template.component.html',
  styleUrl: './auth-template.component.css'
})
export class AuthTemplateComponent {
  // Template container - content will be projected
}

