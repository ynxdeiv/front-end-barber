import { Component, Input, Output, EventEmitter, forwardRef, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css'
})
export class InputComponent implements ControlValueAccessor, OnChanges {
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() disabled = false;
  @Input() name: string = '';
  @Input() class: string = '';
  @Input() value: string = '';
  @Output() valueChange = new EventEmitter<string>();

  private _value: string = '';
  onChange = (value: string) => {};
  onTouched = () => {};

  writeValue(value: string): void {
    if (value !== this._value) {
      this._value = value || '';
      this.value = this._value;
    }
  }

  get internalValue(): string {
    return this._value || this.value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(value: string): void {
    this._value = value || '';
    this.value = this._value;
    this.onChange(this._value);
    this.valueChange.emit(this._value);
    this.onTouched();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value'] && changes['value'].currentValue !== this._value) {
      this._value = changes['value'].currentValue || '';
    }
  }
}

