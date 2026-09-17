import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Menu } from '../../componentes/menu/menu';
import { Footer } from '../../componentes/footer/footer';
import { Auth } from '../../services/auth';
import { UsuarioSessao } from '../../models/usuario.model';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [Menu, Footer],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css'
})
export class Perfil {
  usuario: UsuarioSessao | null;

  constructor(private auth: Auth, private router: Router) {
    this.usuario = this.auth.usuarioAtual();
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/home']);
  }

  excluirConta(): void {
    const confirmou = confirm('Deseja realmente excluir sua conta deste navegador?');
    if (!confirmou) return;

    this.auth.excluirContaAtual();
    this.router.navigate(['/home']);
  }
}
