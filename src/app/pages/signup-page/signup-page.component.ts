import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailValidator, FormsModule } from '@angular/forms';
import { AuthTemplateComponent } from '../../shared/templates/auth-template/auth-template.component';
import { AuthImageComponent } from '../../shared/organisms/auth-image/auth-image.component';
import { SignupFormComponent } from '../../shared/organisms/signup-form/signup-form.component';
import { UsuarioRepository } from '../../repositories/UsuarioRepository';

@Component({
  selector: 'app-signup-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AuthTemplateComponent,
    AuthImageComponent,
    SignupFormComponent
  ],
  templateUrl: './signup-page.component.html',
  styleUrl: './signup-page.component.css'
})
export class SignupPageComponent {
  showPassword = false;
  signupImageUrl = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBucafKJqSrEUfJkcdu3nbF6m1sAS1hA2gTlxGdAXsoYVgGEVq-JRimXdjiZmVU_eU8Uvy8nT9DYweKGFoC94cfAymxrpTzMF66OawVxC3LvF8cwIxwEm2oh026Un6fdg4FijVS3ujQ0DlWjqLkaTrVitOQ-qGr6NP5olpiSNWpWd7F5h6GfeUDQn1duA17OiO-YkE8a_QvBC4OQCneGcwMYCx3Eqf6PKwUAf9VAc9yRE5jqrCHcmwhdFpc7j3eIZGWRjRdmdF_BazL';
  signupImageAlt = 'A stylish barber with a beard carefully trimming a client\'s hair in a modern, well-lit barbershop.';

  private usuarioRepo = new UsuarioRepository();

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSignupSubmit(data: { id: number; name: string; email: string; phone: string; password: string  }) {
      const result = this.usuarioRepo.cadastrar(data);
      alert(result);
  }
}
