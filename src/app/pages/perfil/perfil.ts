import {
  CommonModule
} from '@angular/common';

import {
  Component
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  Router
} from '@angular/router';

import {
  Menu
} from '../../componentes/menu/menu';

import {
  Footer
} from '../../componentes/footer/footer';

import {
  Auth
} from '../../services/auth';

import {
  PetService
} from '../../services/pet';

import {
  ComunidadeService
} from '../../services/comunidade';

import {
  AdocaoService
} from '../../services/adocao';

import {
  UsuarioSessao
} from '../../models/usuario.model';

import {
  Pet
} from '../../models/pet.model';

import {
  Post
} from '../../models/post.model';

import {
  SolicitacaoAdocao,
  BloqueioUsuario
} from '../../models/solicitacao.model';


@Component({
  selector: 'app-perfil',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    Menu,
    Footer
  ],

  templateUrl:
    './perfil.html',

  styleUrl:
    './perfil.css'
})
export class Perfil {

  usuario:
    UsuarioSessao | null;


  petsPublicados:
    Pet[] = [];


  postsPublicados:
    Post[] = [];


  solicitacoesRecebidas:
    SolicitacaoAdocao[] = [];


  solicitacoesEnviadas:
    SolicitacaoAdocao[] = [];


  usuariosBloqueados:
    BloqueioUsuario[] = [];


  senhaAtual =
    '';


  novaSenha =
    '';


  confirmarNovaSenha =
    '';


  mensagemSenha =
    '';


  senhaAlterada =
    false;


  constructor(

    private auth:
      Auth,

    private router:
      Router,

    private petService:
      PetService,

    private comunidadeService:
      ComunidadeService,

    private adocaoService:
      AdocaoService

  ) {

    this.usuario =
      this.auth.usuarioAtual();


    this.carregarPublicacoes();

    this.carregarSolicitacoes();

    this.carregarBloqueios();
  }


  carregarPublicacoes(): void {

    if (!this.usuario) {

      return;
    }


    this.petsPublicados =
      this.petService
        .listarDoUsuario(
          this.usuario.id
        );


    this.postsPublicados =
      this.comunidadeService
        .listarDoUsuario(
          this.usuario.id
        );
  }


  carregarSolicitacoes(): void {

    if (!this.usuario) {

      return;
    }


    this.solicitacoesRecebidas =
      this.adocaoService
        .listarRecebidas(
          this.usuario.id
        );


    this.solicitacoesEnviadas =
      this.adocaoService
        .listarEnviadas(
          this.usuario.id
        );
  }


  carregarBloqueios(): void {

    if (!this.usuario) {

      return;
    }


    this.usuariosBloqueados =
      this.adocaoService
        .listarBloqueadosPor(
          this.usuario.id
        );
  }


  desbloquearUsuario(
    usuarioId: number
  ): void {

    if (!this.usuario) {

      return;
    }


    const bloqueio =
      this.usuariosBloqueados
        .find(

          item =>
            item.bloqueadoId ===
            usuarioId

        );


    if (!bloqueio) {

      return;
    }


    const confirmou =
      confirm(

        `Deseja desbloquear ${bloqueio.bloqueadoNome}?`

      );


    if (!confirmou) {

      return;
    }


    this.adocaoService
      .desbloquearUsuario(

        this.usuario.id,

        usuarioId

      );


    this.carregarBloqueios();
  }


  alterarSenha(): void {

    this.mensagemSenha =
      '';


    this.senhaAlterada =
      false;


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


    if (
      resultado.ok
    ) {

      this.senhaAtual =
        '';

      this.novaSenha =
        '';

      this.confirmarNovaSenha =
        '';

    }
  }


  aceitarSolicitacao(
    id: number
  ): void {

    if (!this.usuario) {

      return;
    }


    const confirmou =
      confirm(

        'Deseja aceitar esta solicitação de adoção?'

      );


    if (!confirmou) {

      return;
    }


    this.adocaoService
      .aceitar(

        id,

        this.usuario.id

      );


    this.carregarSolicitacoes();

    this.carregarPublicacoes();
  }


  recusarSolicitacao(
    id: number
  ): void {

    if (!this.usuario) {

      return;
    }


    const confirmou =
      confirm(

        'Deseja recusar esta solicitação?'

      );


    if (!confirmou) {

      return;
    }


    this.adocaoService
      .recusar(

        id,

        this.usuario.id

      );


    this.carregarSolicitacoes();
  }


  abrirChat(
    id: number
  ): void {

    this.router.navigate(
      ['/chat', id]
    );
  }


  excluirPet(
    id: number
  ): void {

    if (!this.usuario) {

      return;
    }


    const confirmou =
      confirm(

        'Deseja realmente apagar esta publicação de adoção?'

      );


    if (!confirmou) {

      return;
    }


    this.adocaoService
      .excluirPorPet(id);


    this.petService
      .excluirDoUsuario(

        id,

        this.usuario.id

      );


    this.carregarPublicacoes();

    this.carregarSolicitacoes();
  }


  excluirPost(
    id: number
  ): void {

    if (!this.usuario) {

      return;
    }


    const confirmou =
      confirm(

        'Deseja realmente apagar esta publicação da comunidade?'

      );


    if (!confirmou) {

      return;
    }


    this.comunidadeService
      .excluirDoUsuario(

        id,

        this.usuario.id

      );


    this.carregarPublicacoes();
  }


  logout(): void {

    this.auth.logout();


    this.router.navigate(
      ['/home']
    );
  }


  excluirConta(): void {

    const confirmou =
      confirm(

        'Deseja realmente excluir sua conta deste navegador?'

      );


    if (!confirmou) {

      return;
    }


    if (this.usuario) {

      this.adocaoService
        .excluirDadosUsuario(
          this.usuario.id
        );


      this.petsPublicados
        .forEach(

          pet =>

            this.petService
              .excluirDoUsuario(

                pet.id,

                this.usuario!.id

              )

        );


      this.postsPublicados
        .forEach(

          post =>

            this.comunidadeService
              .excluirDoUsuario(

                post.id,

                this.usuario!.id

              )

        );
    }


    this.auth
      .excluirContaAtual();


    this.router.navigate(
      ['/home']
    );
  }
}