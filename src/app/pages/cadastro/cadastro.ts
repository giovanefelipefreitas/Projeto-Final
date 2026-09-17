import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import { Menu } from '../../componentes/menu/menu';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, Menu],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css'
})
export class Cadastro {
  nome = '';
  email = '';
  senha = '';
  confirmarSenha = '';
  aceitouLgpd = false;
  mensagemErro = '';

  constructor(private auth: Auth, private router: Router) {}

  cadastrar(): void {
    this.mensagemErro = '';

    if (!this.nome.trim() || !this.email.trim() || !this.senha || !this.confirmarSenha) {
      this.mensagemErro = 'Preencha todos os campos.';
      return;
    }

    if (this.senha.length < 6) {
      this.mensagemErro = 'A senha deve ter pelo menos 6 caracteres.';
      return;
    }

    if (this.senha !== this.confirmarSenha) {
      this.mensagemErro = 'As senhas não coincidem.';
      return;
    }

    if (!this.aceitouLgpd) {
      this.mensagemErro = 'Você precisa aceitar a Política de Privacidade para continuar.';
      return;
    }

    const resultado = this.auth.cadastrar(this.nome, this.email, this.senha, this.aceitouLgpd);

    if (!resultado.ok) {
      this.mensagemErro = resultado.mensagem;
      return;
    }

    this.router.navigate(['/login']);
  }
}
