import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../atoms/icon/icon.component';
import { ButtonComponent } from '../../atoms/button/button.component';

@Component({
  selector: 'app-time-slot-item',
  standalone: true,
  imports: [CommonModule, IconComponent, ButtonComponent],
  templateUrl: './time-slot-item.component.html',
  styleUrl: './time-slot-item.component.css'
})
export class TimeSlotItemComponent {
  @Input() start: string = '';
  @Input() end: string = '';
  @Input() available: boolean = true;
  @Input() selected: boolean = false;
  @Output() schedule = new EventEmitter<void>();

  onSchedule(): void {
    if (this.available) {
      this.schedule.emit();
    }
  }
}

