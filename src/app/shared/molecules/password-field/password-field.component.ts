import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '../../atoms/input/input.component';
import { LabelComponent } from '../../atoms/label/label.component';
import { IconComponent } from '../../atoms/icon/icon.component';

@Component({
  selector: 'app-password-field',
  standalone: true,
  imports: [CommonModule, FormsModule, InputComponent, LabelComponent, IconComponent],
  templateUrl: './password-field.component.html',
  styleUrl: './password-field.component.css'
})
export class PasswordFieldComponent {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() name: string = '';
  @Input() showPassword = false;
  @Input() value: string = '';
  @Output() valueChange = new EventEmitter<string>();
  @Output() togglePassword = new EventEmitter<void>();

  onValueChange(value: string): void {
    this.value = value;
    this.valueChange.emit(value);
  }

  onToggleClick(): void {
    this.togglePassword.emit();
  }
}

