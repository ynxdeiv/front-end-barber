import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserType } from '../../../models/user';
import { CardComponent } from '../../atoms/card/card.component';
import { IconComponent } from '../../atoms/icon/icon.component';

@Component({
  selector: 'app-user-type-selector',
  standalone: true,
  imports: [CommonModule, CardComponent, IconComponent],
  templateUrl: './user-type-selector.component.html',
  styleUrl: './user-type-selector.component.css'
})
export class UserTypeSelectorComponent {
  @Input() selectedType: UserType | null = null;
  @Output() typeSelected = new EventEmitter<UserType>();

  selectType(type: UserType): void {
    this.selectedType = type;
    this.typeSelected.emit(type);
  }
}

