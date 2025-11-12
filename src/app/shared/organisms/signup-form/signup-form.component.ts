import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Validators, FormControl, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FormFieldComponent } from '../../molecules/form-field/form-field.component';
import { PasswordFieldComponent } from '../../molecules/password-field/password-field.component';
import { LinkComponent } from '../../atoms/link/link.component';

@Component({
  selector: 'app-signup-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FormFieldComponent,
    PasswordFieldComponent,
    LinkComponent
  ],
  templateUrl: './signup-form.component.html',
  styleUrl: './signup-form.component.css'
})
export class SignupFormComponent {
  @Input() showPassword = false;
  @Output() togglePassword = new EventEmitter<void>();
  @Output() submit = new EventEmitter<{ id: number, name: string; email: string; phone: string; password: string }>();

  id = 0;
  name = '';
  email = '';
  phone = '';
  password = '';

  constructor(private router: Router) {}

  validateName(name: string): boolean {
    const trimmedName = name.trim();
    const nameRegex = /^[A-Za-zÀ-ÿ\s]{3,}$/;
    return nameRegex.test(trimmedName);
  }

  validateEmail(email: string): boolean {
    const value = (email || '').trim();
    if (!value) return false;
    const control = new FormControl(value);
    const validationResult = Validators.email(control); 
    return validationResult === null;
  }

  validatePhone(phone: string): boolean {
    const phoneRegex = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;
    return phoneRegex.test(phone);
  }

  validatePassword(password: string) : boolean {
    return password.trim().length >= 6;
  }

  onTogglePassword() {
    this.togglePassword.emit();
  }

  onSubmit(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    if (!this.validateName(this.name)) {
      alert('Tem certeza que esse é seu nome?')
      return;
    }

    if (!this.validateEmail(this.email)) {
      alert('E-mail inválido!');
      return;
    }

    if (!this.validatePhone(this.phone)) {
      alert('Telefone inválido! Use o formato (XX)XXXXX-XXXX');
      return;
    }
    
    if (!this.validatePassword(this.password)) {
      alert('Senha inválida! Deve conter ao menos 6 caracteres.')
      return;
    }

    this.submit.emit({
      id: this.id,
      name: this.name,
      email: this.email,
      phone: this.phone,
      password: this.password
    });
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}

