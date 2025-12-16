import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LandingTemplateComponent } from '../../shared/templates/landing-template/landing-template.component';
import { HeroSectionComponent } from '../../shared/organisms/hero-section/hero-section.component';
import { ServicesShowcaseComponent } from '../../shared/organisms/services-showcase/services-showcase.component';
import { GalleryPreviewComponent } from '../../shared/organisms/gallery-preview/gallery-preview.component';
import { ContactSectionComponent } from '../../shared/organisms/contact-section/contact-section.component';
import { BusinessHoursComponent } from '../../shared/organisms/business-hours/business-hours.component';
import { FeatureHighlightComponent } from '../../shared/molecules/feature-highlight/feature-highlight.component';
import { Service } from '../../models/service';
import { DEFAULT_SERVICES } from '../../data/services';
import { GALLERY_ITEMS } from '../../data/gallery';
import { AdminUser } from '../../models/user';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    CommonModule,
    LandingTemplateComponent,
    HeroSectionComponent,
    ServicesShowcaseComponent,
    GalleryPreviewComponent,
    ContactSectionComponent,
    BusinessHoursComponent,
    FeatureHighlightComponent
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent implements OnInit {
  services: Service[] = DEFAULT_SERVICES;
  galleryItems = GALLERY_ITEMS;
  
  // Dados mockados - em produção viriam de um serviço
  contactInfo = {
    phone: '(71) 99999-9999',
    email: 'contato@barberagenda.com',
    address: 'Rua Exemplo, 123 - Salvador, BA',
    socialMedia: [
      { platform: 'instagram' as const, url: 'https://instagram.com' },
      { platform: 'facebook' as const, url: 'https://facebook.com' },
      { platform: 'whatsapp' as const, url: 'https://wa.me/5571999999999' }
    ]
  };

  businessHours: AdminUser['businessHours'] = {
    monday: { open: '09:00', close: '18:00', closed: false },
    tuesday: { open: '09:00', close: '18:00', closed: false },
    wednesday: { open: '09:00', close: '18:00', closed: false },
    thursday: { open: '09:00', close: '18:00', closed: false },
    friday: { open: '09:00', close: '18:00', closed: false },
    saturday: { open: '09:00', close: '18:00', closed: false },
    sunday: { open: '09:00', close: '18:00', closed: true }
  };

  features = [
    {
      icon: 'star',
      title: 'Profissionais Qualificados',
      description: 'Barbeiros experientes e certificados para garantir o melhor resultado'
    },
    {
      icon: 'schedule',
      title: 'Agendamento Online',
      description: 'Agende seu horário de forma rápida e prática pelo nosso sistema'
    },
    {
      icon: 'verified',
      title: 'Qualidade Garantida',
      description: 'Produtos premium e técnicas modernas para seu melhor visual'
    },
    {
      icon: 'local_offer',
      title: 'Preços Acessíveis',
      description: 'Serviços de qualidade com preços justos e competitivos'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Carregar dados reais se houver usuário admin logado
    // Por enquanto usa dados mockados
  }

  onBookService(service: Service): void {
    // Redirecionar para agendamento com serviço pré-selecionado
    this.router.navigate(['/appointment'], {
      queryParams: { serviceId: service.id }
    });
  }
}

