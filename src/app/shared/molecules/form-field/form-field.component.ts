import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '../../atoms/input/input.component';
import { LabelComponent } from '../../atoms/label/label.component';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [CommonModule, FormsModule, InputComponent, LabelComponent],
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.css'
})
export class FormFieldComponent {
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() name: string = '';
  @Input() disabled = false;
  @Input() value: string = '';
  @Output() valueChange = new EventEmitter<string>();

  onValueChange(value: string): void {
    this.value = value;
    this.valueChange.emit(value);
  }
}

