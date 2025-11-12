import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FormFieldComponent } from '../../molecules/form-field/form-field.component';
import { PasswordFieldComponent } from '../../molecules/password-field/password-field.component';
import { ButtonComponent } from '../../atoms/button/button.component';
import { LinkComponent } from '../../atoms/link/link.component';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FormFieldComponent,
    PasswordFieldComponent,
    ButtonComponent,
    LinkComponent
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent {
  @Input() showPassword = false;
  @Output() togglePassword = new EventEmitter<void>();
  @Output() submit = new EventEmitter<{ email: string; password: string }>();

  email = '';
  password = '';

  constructor(private router: Router) {}

  onTogglePassword() {
    this.togglePassword.emit();
  }

  onSubmit(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.submit.emit({ email: this.email, password: this.password });
  }

  navigateToSignup() {
    this.router.navigate(['/signup']);
  }
}

