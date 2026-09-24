import {
  CommonModule
} from '@angular/common';

import {
  Component,
  HostListener,
  OnInit
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  ActivatedRoute,
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
  AdocaoService
} from '../../services/adocao';

import {
  UsuarioSessao
} from '../../models/usuario.model';

import {
  SolicitacaoAdocao,
  MensagemChat
} from '../../models/solicitacao.model';


@Component({
  selector: 'app-chat',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    Menu,
    Footer
  ],

  templateUrl:
    './chat.html',

  styleUrl:
    './chat.css'
})
export class Chat
  implements OnInit {


  usuario:
    UsuarioSessao | null =
      null;


  solicitacao:
    SolicitacaoAdocao | null =
      null;


  mensagens:
    MensagemChat[] = [];


  texto =
    '';


  constructor(

    private route:
      ActivatedRoute,

    private router:
      Router,

    private auth:
      Auth,

    private adocaoService:
      AdocaoService

  ) {}


  ngOnInit(): void {

    this.usuario =
      this.auth.usuarioAtual();


    if (!this.usuario) {

      this.router.navigate(
        ['/login']
      );

      return;
    }


    const id =
      Number(

        this.route
          .snapshot
          .paramMap
          .get('id')

      );


    if (
      !id

      ||

      !this.adocaoService
        .podeAcessarChat(

          id,

          this.usuario.id

        )
    ) {

      this.router.navigate(
        ['/perfil']
      );

      return;
    }


    this.solicitacao =
      this.adocaoService
        .buscarPorId(
          id
        )

      || null;


    this.carregarMensagens();
  }


  carregarMensagens(): void {

    if (
      !this.solicitacao
    ) {

      return;
    }


    this.mensagens =
      this.adocaoService
        .listarMensagens(

          this.solicitacao.id

        );
  }


  enviar(): void {

    if (
      !this.usuario ||
      !this.solicitacao
    ) {

      return;
    }


    if (
      !this.texto.trim()
    ) {

      return;
    }


    const enviou =
      this.adocaoService
        .enviarMensagem(

          this.solicitacao.id,

          this.usuario,

          this.texto

        );


    if (!enviou) {

      return;
    }


    this.texto =
      '';


    this.carregarMensagens();
  }


  cancelarProcesso(): void {

    if (
      !this.usuario ||
      !this.solicitacao ||
      !this.ehDoador
    ) {

      return;
    }


    const confirmou =
      confirm(

        'Deseja cancelar este processo de adoção? O animal voltará a ficar disponível.'

      );


    if (!confirmou) {

      return;
    }


    const resultado =
      this.adocaoService
        .cancelarConversa(

          this.solicitacao.id,

          this.usuario.id

        );


    alert(
      resultado.mensagem
    );


    if (
      resultado.ok
    ) {

      this.router.navigate(
        ['/perfil']
      );

    }
  }


  marcarComoAdotado(): void {

    if (
      !this.usuario ||
      !this.solicitacao ||
      !this.ehDoador
    ) {

      return;
    }


    const confirmou =
      confirm(

        `Confirma que a adoção de ${this.solicitacao.petNome} foi concluída?`

      );


    if (!confirmou) {

      return;
    }


    const resultado =
      this.adocaoService
        .concluirAdocao(

          this.solicitacao.id,

          this.usuario.id

        );


    alert(
      resultado.mensagem
    );


    if (
      resultado.ok
    ) {

      this.router.navigate(
        ['/perfil']
      );

    }
  }


  bloquearInteressado(): void {

    if (
      !this.usuario ||
      !this.solicitacao ||
      !this.ehDoador
    ) {

      return;
    }


    const confirmou =
      confirm(

        `Deseja bloquear ${this.solicitacao.interessadoNome}? A conversa será encerrada e esta pessoa não poderá mais solicitar seus animais para adoção.`

      );


    if (!confirmou) {

      return;
    }


    const resultado =
      this.adocaoService
        .bloquearUsuario(

          this.solicitacao.id,

          this.usuario

        );


    alert(
      resultado.mensagem
    );


    if (
      resultado.ok
    ) {

      this.router.navigate(
        ['/perfil']
      );

    }
  }


  @HostListener(
    'window:storage',
    ['$event']
  )
  aoAlterarLocalStorage(
    event: StorageEvent
  ): void {

    if (
      event.key ===
      'adotassa_mensagens'
    ) {

      this.carregarMensagens();

    }


    if (
      event.key ===
        'adotassa_solicitacoes'

      ||

      event.key ===
        'adotassa_bloqueios'
    ) {

      if (
        !this.solicitacao ||
        !this.usuario
      ) {

        return;
      }


      const atualizada =
        this.adocaoService
          .buscarPorId(

            this.solicitacao.id

          );


      if (
        !atualizada

        ||

        !this.adocaoService
          .podeAcessarChat(

            this.solicitacao.id,

            this.usuario.id

          )
      ) {

        this.router.navigate(
          ['/perfil']
        );

        return;
      }


      this.solicitacao =
        atualizada;
    }
  }


  get ehDoador():
    boolean {

    if (
      !this.usuario ||
      !this.solicitacao
    ) {

      return false;
    }


    return (

      this.usuario.id ===
      this.solicitacao.doadorId

    );
  }


  get outroUsuario():
    string {

    if (
      !this.usuario ||
      !this.solicitacao
    ) {

      return '';
    }


    if (
      this.usuario.id ===
      this.solicitacao.doadorId
    ) {

      return this.solicitacao
        .interessadoNome;
    }


    return this.solicitacao
      .doadorNome;
  }
}