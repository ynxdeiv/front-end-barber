import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

export type SocialPlatform = 'facebook' | 'instagram' | 'whatsapp' | 'twitter' | 'youtube';

@Component({
  selector: 'app-social-link',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './social-link.component.html',
  styleUrl: './social-link.component.css'
})
export class SocialLinkComponent {
  @Input() platform: SocialPlatform = 'instagram';
  @Input() url: string = '#';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  get iconName(): string {
    const icons: Record<SocialPlatform, string> = {
      facebook: 'facebook',
      instagram: 'instagram',
      whatsapp: 'whatsapp',
      twitter: 'twitter',
      youtube: 'youtube'
    };
    return icons[this.platform] || 'link';
  }

  get platformColor(): string {
    const colors: Record<SocialPlatform, string> = {
      facebook: 'text-blue-600 dark:text-blue-400',
      instagram: 'text-pink-600 dark:text-pink-400',
      whatsapp: 'text-green-600 dark:text-green-400',
      twitter: 'text-blue-400 dark:text-blue-300',
      youtube: 'text-red-600 dark:text-red-400'
    };
    return colors[this.platform] || 'text-text-muted-dark dark:text-text-muted-light';
  }
}

