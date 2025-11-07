import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../organisms/sidebar/sidebar.component';
import { IconComponent } from '../../atoms/icon/icon.component';

@Component({
  selector: 'app-dashboard-template',
  standalone: true,
  imports: [CommonModule, SidebarComponent, IconComponent],
  templateUrl: './dashboard-template.component.html',
  styleUrl: './dashboard-template.component.css'
})
export class DashboardTemplateComponent implements OnInit {
  isSidebarOpen = true;
  isMobile = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkMobile();
    if (!this.isMobile) {
      this.isSidebarOpen = true;
    }
  }

  ngOnInit() {
    this.checkMobile();
    if (this.isMobile) {
      this.isSidebarOpen = false;
    }
  }

  checkMobile() {
    this.isMobile = window.innerWidth < 769;
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}

