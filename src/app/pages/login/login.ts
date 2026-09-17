import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../../services/auth';
import { Menu } from '../../componentes/menu/menu';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule, Menu],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  email = '';
  senha = '';
  mensagemErro = '';

  constructor(private auth: Auth, private router: Router) {}

  entrar(): void {
    this.mensagemErro = '';

    if (!this.email.trim() || !this.senha) {
      this.mensagemErro = 'Preencha o e-mail e a senha.';
      return;
    }

    if (this.auth.login(this.email, this.senha)) {
      this.router.navigate(['/home']);
      return;
    }

    this.mensagemErro = 'E-mail ou senha incorretos.';
  }
}
