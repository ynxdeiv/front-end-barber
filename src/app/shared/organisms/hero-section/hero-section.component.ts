import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../atoms/button/button.component';
import { IconComponent } from '../../atoms/icon/icon.component';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, ButtonComponent, IconComponent],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.css'
})
export class HeroSectionComponent {
  @Input() title: string = 'Bem-vindo à Nossa Barbearia';
  @Input() subtitle: string = 'Estilo e qualidade para você';
  @Input() description: string = 'Agende seu horário e transforme seu visual com nossos profissionais experientes.';
  @Input() ctaText: string = 'Agendar Agora';
  @Input() backgroundImage?: string;
  @Input() heroImage: string = 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&auto=format&fit=crop&q=80';
  @Input() heroImageAlt: string = 'Barbearia moderna e profissional';

  constructor(private router: Router) {}

  onCtaClick(): void {
    this.router.navigate(['/appointment']);
  }
}
