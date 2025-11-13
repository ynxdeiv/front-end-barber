import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthTemplateComponent } from '../../shared/templates/auth-template/auth-template.component';
import { AuthImageComponent } from '../../shared/organisms/auth-image/auth-image.component';
import { AuthHeaderComponent } from '../../shared/organisms/auth-header/auth-header.component';
import { LoginFormComponent } from '../../shared/organisms/login-form/login-form.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AuthTemplateComponent,
    AuthImageComponent,
    AuthHeaderComponent,
    LoginFormComponent
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  showPassword = false;
  loginImageUrl = 'https://nucleocursos.com.br/blog/wp-content/uploads/2024/03/Curso-de-barbearia-profissional.jpg';
  loginImageAlt = 'Curso de barbearia profissional - ambiente de barbearia moderna e equipada.';
  
  showErrorMessage = signal(false);
  errorMessage = signal('');

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onLoginSubmit(data: { email: string; password: string }) {
    const result = this.authService.login(data.email, data.password);

    if (result.success && result.user) {
      // Redirecionar baseado no tipo de usuário detectado automaticamente
      if (result.user.type === 'admin') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/appointment']);
      }
    } else {
      this.showErrorMessage.set(true);
      this.errorMessage.set(result.message);
    }
  }
}

