import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailValidator, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthTemplateComponent } from '../../shared/templates/auth-template/auth-template.component';
import { AuthImageComponent } from '../../shared/organisms/auth-image/auth-image.component';
import { AuthHeaderComponent } from '../../shared/organisms/auth-header/auth-header.component';
import { LoginFormComponent } from '../../shared/organisms/login-form/login-form.component';
import { UsuarioRepository } from '../../repositories/UsuarioRepository';

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

  private usuarioRepo = new UsuarioRepository();

  constructor(private router: Router) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onLoginSubmit(data: { email: string; password: string }) {
    console.log('Login:', data);
    const { email, password } = data;
    const valido = this.usuarioRepo.validarLogin(email, password);

    if (valido) {
      const usuario = this.usuarioRepo.buscarPorEmail(email);
      alert(`Bem-vindo, ${usuario?.name}!`);
      this.router.navigate(['/appointment']);
    } 
    else {
      alert('E-mail ou senha incorretos.');
    }
  }
}

