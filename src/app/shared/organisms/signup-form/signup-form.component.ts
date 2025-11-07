import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  @Output() submit = new EventEmitter<{ name: string; email: string; phone: string; password: string }>();

  name = '';
  email = '';
  phone = '';
  password = '';

  constructor(private router: Router) {}

  onTogglePassword() {
    this.togglePassword.emit();
  }

  onSubmit() {
    this.submit.emit({
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

