import { EmailValidator } from '@angular/forms';
import { USUARIOS } from '../data/usuarios';
import { Usuario } from '../models/usuario';


export class UsuarioRepository {
  private usuarios: Usuario[] = USUARIOS;

  listar(): Usuario[] {
    return this.usuarios;
  }

  buscarPorEmail(email: string): Usuario | undefined {
    return this.usuarios.find(u => u.email === email);
  }

  cadastrar(usuario: Usuario): string {

    const existe = this.usuarios.some(u => u.email === usuario.email);
    if (existe) {
      return 'Usuário já cadastrado!';
    }

    this.usuarios.push(usuario);
    return 'Usuário cadastrado com sucesso!';
  }

  atualizar(id: number, dados: Partial<Usuario>): void {
    const usuario = this.usuarios.find(u => u.id === id);
    if (usuario) Object.assign(usuario, dados);
  }

  remover(id: number): void {
    this.usuarios = this.usuarios.filter(u => u.id !== id);
  }

  validarLogin(email: string, password: string): boolean {
    const usuario = this.buscarPorEmail(email);
    return !!usuario && usuario.password === password;
  }
}
