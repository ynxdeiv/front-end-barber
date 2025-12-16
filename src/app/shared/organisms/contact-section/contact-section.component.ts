import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../atoms/icon/icon.component';
import { SocialLinkComponent, SocialPlatform } from '../../atoms/social-link/social-link.component';

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  socialMedia?: {
    platform: SocialPlatform;
    url: string;
  }[];
}

@Component({
  selector: 'app-contact-section',
  standalone: true,
  imports: [CommonModule, IconComponent, SocialLinkComponent],
  templateUrl: './contact-section.component.html',
  styleUrl: './contact-section.component.css'
})
export class ContactSectionComponent {
  @Input() contactInfo!: ContactInfo;
  @Input() title: string = 'Entre em Contato';
}

