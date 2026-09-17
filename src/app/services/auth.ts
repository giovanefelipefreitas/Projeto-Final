import { Injectable } from '@angular/core';
import { Usuario, UsuarioSessao } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class Auth {
  private readonly chaveUsuarios = 'adotassa_usuarios';
  private readonly chaveSessao = 'adotassa_sessao';

  cadastrar(nome: string, email: string, senha: string, aceitouLgpd: boolean): { ok: boolean; mensagem: string } {
    const usuarios = this.listarUsuarios();
    const emailNormalizado = email.trim().toLowerCase();

    if (usuarios.some(u => u.email.toLowerCase() === emailNormalizado)) {
      return { ok: false, mensagem: 'Já existe uma conta cadastrada com este e-mail.' };
    }

    const novoUsuario: Usuario = {
      id: Date.now(),
      nome: nome.trim(),
      email: emailNormalizado,
      senha,
      aceitouLgpd
    };

    usuarios.push(novoUsuario);
    localStorage.setItem(this.chaveUsuarios, JSON.stringify(usuarios));

    return { ok: true, mensagem: 'Cadastro realizado com sucesso.' };
  }

  login(email: string, senha: string): boolean {
    const usuario = this.listarUsuarios().find(
      u => u.email.toLowerCase() === email.trim().toLowerCase() && u.senha === senha
    );

    if (!usuario) {
      return false;
    }

    const sessao: UsuarioSessao = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email
    };

    sessionStorage.setItem(this.chaveSessao, JSON.stringify(sessao));
    return true;
  }

  logout(): void {
    sessionStorage.removeItem(this.chaveSessao);
  }

  estaAutenticado(): boolean {
    return sessionStorage.getItem(this.chaveSessao) !== null;
  }

  usuarioAtual(): UsuarioSessao | null {
    const valor = sessionStorage.getItem(this.chaveSessao);
    return valor ? JSON.parse(valor) as UsuarioSessao : null;
  }

  excluirContaAtual(): void {
    const atual = this.usuarioAtual();
    if (!atual) return;

    const usuarios = this.listarUsuarios().filter(u => u.id !== atual.id);
    localStorage.setItem(this.chaveUsuarios, JSON.stringify(usuarios));
    this.logout();
  }

  private listarUsuarios(): Usuario[] {
    const valor = localStorage.getItem(this.chaveUsuarios);
    return valor ? JSON.parse(valor) as Usuario[] : [];
  }
}
