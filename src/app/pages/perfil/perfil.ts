import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Menu } from '../../componentes/menu/menu';
import { Footer } from '../../componentes/footer/footer';

import { Auth } from '../../services/auth';
import { PetService } from '../../services/pet';
import { ComunidadeService } from '../../services/comunidade';

import { UsuarioSessao } from '../../models/usuario.model';
import { Pet } from '../../models/pet.model';
import { Post } from '../../models/post.model';

@Component({
  selector: 'app-perfil',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    Menu,
    Footer
  ],

  templateUrl: './perfil.html',
  styleUrl: './perfil.css'
})
export class Perfil {

  usuario: UsuarioSessao | null;


  petsPublicados: Pet[] = [];

  postsPublicados: Post[] = [];


  senhaAtual = '';

  novaSenha = '';

  confirmarNovaSenha = '';

  mensagemSenha = '';

  senhaAlterada = false;


  constructor(
    private auth: Auth,
    private router: Router,
    private petService: PetService,
    private comunidadeService: ComunidadeService
  ) {

    this.usuario =
      this.auth.usuarioAtual();

    this.carregarPublicacoes();
  }


  carregarPublicacoes(): void {

    if (!this.usuario) {
      return;
    }


    this.petsPublicados =
      this.petService.listarDoUsuario(
        this.usuario.id
      );


    this.postsPublicados =
      this.comunidadeService.listarDoUsuario(
        this.usuario.id
      );
  }


  alterarSenha(): void {

    this.mensagemSenha = '';

    this.senhaAlterada = false;


    if (
      !this.senhaAtual ||
      !this.novaSenha ||
      !this.confirmarNovaSenha
    ) {

      this.mensagemSenha =
        'Preencha todos os campos.';

      return;
    }


    if (
      this.novaSenha !==
      this.confirmarNovaSenha
    ) {

      this.mensagemSenha =
        'As novas senhas não são iguais.';

      return;
    }


    const resultado =
      this.auth.alterarSenha(
        this.senhaAtual,
        this.novaSenha
      );


    this.mensagemSenha =
      resultado.mensagem;


    this.senhaAlterada =
      resultado.ok;


    if (resultado.ok) {

      this.senhaAtual = '';

      this.novaSenha = '';

      this.confirmarNovaSenha = '';
    }
  }


  excluirPet(id: number): void {

    if (!this.usuario) {
      return;
    }


    const confirmou = confirm(
      'Deseja realmente apagar esta publicação de adoção?'
    );


    if (!confirmou) {
      return;
    }


    this.petService.excluirDoUsuario(
      id,
      this.usuario.id
    );


    this.carregarPublicacoes();
  }


  excluirPost(id: number): void {

    if (!this.usuario) {
      return;
    }


    const confirmou = confirm(
      'Deseja realmente apagar esta publicação da comunidade?'
    );


    if (!confirmou) {
      return;
    }


    this.comunidadeService.excluirDoUsuario(
      id,
      this.usuario.id
    );


    this.carregarPublicacoes();
  }


  logout(): void {

    this.auth.logout();

    this.router.navigate(['/home']);
  }


  excluirConta(): void {

    const confirmou = confirm(
      'Deseja realmente excluir sua conta deste navegador?'
    );


    if (!confirmou) {
      return;
    }


    if (this.usuario) {

      this.petsPublicados.forEach(
        pet =>
          this.petService.excluirDoUsuario(
            pet.id,
            this.usuario!.id
          )
      );


      this.postsPublicados.forEach(
        post =>
          this.comunidadeService.excluirDoUsuario(
            post.id,
            this.usuario!.id
          )
      );
    }


    this.auth.excluirContaAtual();

    this.router.navigate(['/home']);
  }
}