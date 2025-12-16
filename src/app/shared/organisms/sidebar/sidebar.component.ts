import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { IconComponent } from '../../atoms/icon/icon.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Input() isOpen: boolean = true;
  @Output() toggleSidebar = new EventEmitter<void>();

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  onToggleClick(): void {
    this.toggleSidebar.emit();
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}

