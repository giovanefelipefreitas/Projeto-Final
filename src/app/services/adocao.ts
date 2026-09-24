import { Injectable } from '@angular/core';

import { Pet } from '../models/pet.model';

import {
  SolicitacaoAdocao,
  MensagemChat,
  BloqueioUsuario
} from '../models/solicitacao.model';

import {
  UsuarioSessao
} from '../models/usuario.model';

import {
  PetService
} from './pet';


@Injectable({
  providedIn: 'root'
})
export class AdocaoService {

  private readonly chaveSolicitacoes =
    'adotassa_solicitacoes';

  private readonly chaveMensagens =
    'adotassa_mensagens';

  private readonly chaveBloqueios =
    'adotassa_bloqueios';


  constructor(
    private petService: PetService
  ) {}


  criarSolicitacao(
    pet: Pet,
    interessado: UsuarioSessao
  ): {
    ok: boolean;
    mensagem: string;
  } {

    if (pet.demonstrativo) {

      return {
        ok: false,
        mensagem:
          'Este animal é demonstrativo e não possui responsável cadastrado.'
      };
    }


    if (!pet.usuarioId) {

      return {
        ok: false,
        mensagem:
          'Não foi possível identificar o responsável por este animal.'
      };
    }


    if (
      pet.usuarioId ===
      interessado.id
    ) {

      return {
        ok: false,
        mensagem:
          'Você não pode solicitar a adoção de um animal publicado por você.'
      };
    }


    if (
      this.estaBloqueado(
        pet.usuarioId,
        interessado.id
      )
    ) {

      return {
        ok: false,
        mensagem:
          'Você não pode enviar uma solicitação de adoção para este responsável.'
      };
    }


    if (
      pet.status ===
      'Em processo de adoção'
    ) {

      return {
        ok: false,
        mensagem:
          'Este animal já está em processo de adoção.'
      };
    }


    if (
      pet.status ===
      'Adotado'
    ) {

      return {
        ok: false,
        mensagem:
          'Este animal já foi adotado.'
      };
    }


    const solicitacoes =
      this.listar();


    const existente =
      solicitacoes.find(

        solicitacao =>

          solicitacao.petId ===
            pet.id

          &&

          solicitacao.interessadoId ===
            interessado.id

          &&

          (
            solicitacao.status ===
              'Pendente'

            ||

            solicitacao.status ===
              'Aceita'
          )

      );


    if (existente) {

      return {
        ok: false,
        mensagem:
          'Você já demonstrou interesse neste animal.'
      };
    }


    const solicitacao:
      SolicitacaoAdocao = {

      id:
        Date.now(),

      petId:
        pet.id,

      petNome:
        pet.nome,

      petImagem:
        pet.imagem,

      doadorId:
        pet.usuarioId,

      doadorNome:
        pet.usuarioNome ||
        'Responsável pelo animal',

      interessadoId:
        interessado.id,

      interessadoNome:
        interessado.nome,

      interessadoEmail:
        interessado.email,

      status:
        'Pendente',

      criadaEm:
        new Date()
          .toLocaleString('pt-BR')

    };


    solicitacoes.unshift(
      solicitacao
    );


    this.salvarSolicitacoes(
      solicitacoes
    );


    return {
      ok: true,
      mensagem:
        'Interesse enviado ao responsável pelo animal!'
    };
  }


  listar(): SolicitacaoAdocao[] {

    const valor =
      localStorage.getItem(
        this.chaveSolicitacoes
      );


    return valor
      ? JSON.parse(valor)
      : [];
  }


  listarRecebidas(
    usuarioId: number
  ): SolicitacaoAdocao[] {

    return this.listar().filter(

      solicitacao =>
        solicitacao.doadorId ===
        usuarioId

    );
  }


  listarEnviadas(
    usuarioId: number
  ): SolicitacaoAdocao[] {

    return this.listar().filter(

      solicitacao =>
        solicitacao.interessadoId ===
        usuarioId

    );
  }


  buscarPorId(
    id: number
  ): SolicitacaoAdocao | undefined {

    return this.listar().find(

      solicitacao =>
        solicitacao.id === id

    );
  }


  aceitar(
    id: number,
    doadorId: number
  ): boolean {

    const solicitacoes =
      this.listar();


    const solicitacao =
      solicitacoes.find(

        item =>
          item.id === id &&
          item.doadorId ===
            doadorId

      );


    if (
      !solicitacao ||
      solicitacao.status !==
        'Pendente'
    ) {

      return false;
    }


    solicitacao.status =
      'Aceita';


    solicitacoes.forEach(

      item => {

        if (

          item.petId ===
            solicitacao.petId

          &&

          item.id !==
            solicitacao.id

          &&

          item.status ===
            'Pendente'

        ) {

          item.status =
            'Recusada';
        }

      }

    );


    this.salvarSolicitacoes(
      solicitacoes
    );


    this.petService
      .alterarStatus(

        solicitacao.petId,

        'Em processo de adoção'

      );


    return true;
  }


  recusar(
    id: number,
    doadorId: number
  ): boolean {

    const solicitacoes =
      this.listar();


    const solicitacao =
      solicitacoes.find(

        item =>
          item.id === id &&
          item.doadorId ===
            doadorId

      );


    if (
      !solicitacao ||
      solicitacao.status !==
        'Pendente'
    ) {

      return false;
    }


    solicitacao.status =
      'Recusada';


    this.salvarSolicitacoes(
      solicitacoes
    );


    return true;
  }


  cancelarConversa(
    id: number,
    doadorId: number
  ): {
    ok: boolean;
    mensagem: string;
  } {

    const solicitacoes =
      this.listar();


    const solicitacao =
      solicitacoes.find(

        item =>
          item.id === id &&
          item.doadorId ===
            doadorId

      );


    if (!solicitacao) {

      return {
        ok: false,
        mensagem:
          'Solicitação não encontrada.'
      };
    }


    if (
      solicitacao.status !==
      'Aceita'
    ) {

      return {
        ok: false,
        mensagem:
          'Este processo não pode mais ser cancelado.'
      };
    }


    solicitacao.status =
      'Cancelada';


    this.salvarSolicitacoes(
      solicitacoes
    );


    this.petService
      .alterarStatus(

        solicitacao.petId,

        'Disponível'

      );


    this.excluirMensagensDaSolicitacao(
      solicitacao.id
    );


    return {
      ok: true,
      mensagem:
        'Processo cancelado. O animal está disponível para adoção novamente.'
    };
  }


  concluirAdocao(
    id: number,
    doadorId: number
  ): {
    ok: boolean;
    mensagem: string;
  } {

    const solicitacoes =
      this.listar();


    const solicitacao =
      solicitacoes.find(

        item =>
          item.id === id &&
          item.doadorId ===
            doadorId

      );


    if (!solicitacao) {

      return {
        ok: false,
        mensagem:
          'Solicitação não encontrada.'
      };
    }


    if (
      solicitacao.status !==
      'Aceita'
    ) {

      return {
        ok: false,
        mensagem:
          'Esta adoção não pode ser concluída.'
      };
    }


    solicitacao.status =
      'Concluída';


    this.salvarSolicitacoes(
      solicitacoes
    );


    this.petService
      .alterarStatus(

        solicitacao.petId,

        'Adotado'

      );


    return {
      ok: true,
      mensagem:
        'A adoção foi concluída com sucesso.'
    };
  }


  bloquearUsuario(
    solicitacaoId: number,
    doador: UsuarioSessao
  ): {
    ok: boolean;
    mensagem: string;
  } {

    const solicitacoes =
      this.listar();


    const solicitacao =
      solicitacoes.find(

        item =>
          item.id ===
            solicitacaoId

          &&

          item.doadorId ===
            doador.id

      );


    if (!solicitacao) {

      return {
        ok: false,
        mensagem:
          'Solicitação não encontrada.'
      };
    }


    if (
      solicitacao.status !==
      'Aceita'
    ) {

      return {
        ok: false,
        mensagem:
          'Este usuário não pode ser bloqueado por esta conversa.'
      };
    }


    const interessadoId =
      solicitacao.interessadoId;


    const bloqueios =
      this.listarBloqueios();


    const jaBloqueado =
      bloqueios.some(

        bloqueio =>

          bloqueio.bloqueadorId ===
            doador.id

          &&

          bloqueio.bloqueadoId ===
            interessadoId

      );


    if (!jaBloqueado) {

      const novoBloqueio:
        BloqueioUsuario = {

        id:
          Date.now(),

        bloqueadorId:
          doador.id,

        bloqueadorNome:
          doador.nome,

        bloqueadoId:
          solicitacao.interessadoId,

        bloqueadoNome:
          solicitacao.interessadoNome,

        bloqueadoEmail:
          solicitacao.interessadoEmail,

        bloqueadoEm:
          new Date()
            .toLocaleString(
              'pt-BR'
            )

      };


      bloqueios.unshift(
        novoBloqueio
      );


      this.salvarBloqueios(
        bloqueios
      );
    }


    const idsConversas:
      number[] = [];


    solicitacoes.forEach(

      item => {

        if (

          item.doadorId ===
            doador.id

          &&

          item.interessadoId ===
            interessadoId

          &&

          (
            item.status ===
              'Pendente'

            ||

            item.status ===
              'Aceita'
          )

        ) {

          if (
            item.status ===
            'Aceita'
          ) {

            this.petService
              .alterarStatus(

                item.petId,

                'Disponível'

              );

          }


          item.status =
            'Bloqueada';


          idsConversas.push(
            item.id
          );
        }

      }

    );


    this.salvarSolicitacoes(
      solicitacoes
    );


    this.excluirMensagensPorIds(
      idsConversas
    );


    return {
      ok: true,
      mensagem:
        `${solicitacao.interessadoNome} foi bloqueado. O animal voltou a ficar disponível para adoção.`
    };
  }


  listarBloqueadosPor(
    usuarioId: number
  ): BloqueioUsuario[] {

    return this.listarBloqueios()
      .filter(

        bloqueio =>
          bloqueio.bloqueadorId ===
          usuarioId

      );
  }


  estaBloqueado(
    bloqueadorId: number,
    bloqueadoId: number
  ): boolean {

    return this.listarBloqueios()
      .some(

        bloqueio =>

          bloqueio.bloqueadorId ===
            bloqueadorId

          &&

          bloqueio.bloqueadoId ===
            bloqueadoId

      );
  }


  desbloquearUsuario(
    bloqueadorId: number,
    bloqueadoId: number
  ): boolean {

    const bloqueios =
      this.listarBloqueios();


    const quantidadeAntes =
      bloqueios.length;


    const novosBloqueios =
      bloqueios.filter(

        bloqueio =>

          !(
            bloqueio.bloqueadorId ===
              bloqueadorId

            &&

            bloqueio.bloqueadoId ===
              bloqueadoId
          )

      );


    this.salvarBloqueios(
      novosBloqueios
    );


    return (
      novosBloqueios.length <
      quantidadeAntes
    );
  }


  existeSolicitacaoAtiva(
    petId: number,
    usuarioId: number
  ): boolean {

    return this.listar()
      .some(

        solicitacao =>

          solicitacao.petId ===
            petId

          &&

          solicitacao.interessadoId ===
            usuarioId

          &&

          (
            solicitacao.status ===
              'Pendente'

            ||

            solicitacao.status ===
              'Aceita'
          )

      );
  }


  listarMensagens(
    solicitacaoId: number
  ): MensagemChat[] {

    return this
      .listarTodasMensagens()
      .filter(

        mensagem =>
          mensagem.solicitacaoId ===
          solicitacaoId

      );
  }


  enviarMensagem(
    solicitacaoId: number,
    usuario: UsuarioSessao,
    texto: string
  ): boolean {

    const solicitacao =
      this.buscarPorId(
        solicitacaoId
      );


    if (
      !solicitacao ||
      solicitacao.status !==
        'Aceita'
    ) {

      return false;
    }


    const participante =

      solicitacao.doadorId ===
        usuario.id

      ||

      solicitacao.interessadoId ===
        usuario.id;


    if (!participante) {

      return false;
    }


    if (
      this.estaBloqueado(

        solicitacao.doadorId,

        solicitacao.interessadoId

      )
    ) {

      return false;
    }


    const textoLimpo =
      texto.trim();


    if (!textoLimpo) {

      return false;
    }


    const mensagens =
      this.listarTodasMensagens();


    mensagens.push({

      id:
        Date.now(),

      solicitacaoId:
        solicitacaoId,

      autorId:
        usuario.id,

      autorNome:
        usuario.nome,

      texto:
        textoLimpo,

      enviadaEm:
        new Date()
          .toLocaleString(
            'pt-BR'
          )

    });


    localStorage.setItem(

      this.chaveMensagens,

      JSON.stringify(
        mensagens
      )

    );


    return true;
  }


  podeAcessarChat(
    solicitacaoId: number,
    usuarioId: number
  ): boolean {

    const solicitacao =
      this.buscarPorId(
        solicitacaoId
      );


    if (
      !solicitacao ||
      solicitacao.status !==
        'Aceita'
    ) {

      return false;
    }


    if (
      this.estaBloqueado(

        solicitacao.doadorId,

        solicitacao.interessadoId

      )
    ) {

      return false;
    }


    return (

      solicitacao.doadorId ===
        usuarioId

      ||

      solicitacao.interessadoId ===
        usuarioId

    );
  }


  excluirPorPet(
    petId: number
  ): void {

    const solicitacoes =
      this.listar();


    const ids =
      solicitacoes

        .filter(

          solicitacao =>
            solicitacao.petId ===
            petId

        )

        .map(

          solicitacao =>
            solicitacao.id

        );


    const novasSolicitacoes =
      solicitacoes.filter(

        solicitacao =>
          solicitacao.petId !==
          petId

      );


    const mensagens =
      this.listarTodasMensagens()
        .filter(

          mensagem =>
            !ids.includes(
              mensagem.solicitacaoId
            )

        );


    this.salvarSolicitacoes(
      novasSolicitacoes
    );


    localStorage.setItem(

      this.chaveMensagens,

      JSON.stringify(
        mensagens
      )

    );
  }


  excluirDadosUsuario(
    usuarioId: number
  ): void {

    const solicitacoes =
      this.listar();


    const idsRemovidos =
      solicitacoes

        .filter(

          solicitacao =>

            solicitacao.doadorId ===
              usuarioId

            ||

            solicitacao.interessadoId ===
              usuarioId

        )

        .map(

          solicitacao =>
            solicitacao.id

        );


    const novasSolicitacoes =
      solicitacoes.filter(

        solicitacao =>

          solicitacao.doadorId !==
            usuarioId

          &&

          solicitacao.interessadoId !==
            usuarioId

      );


    const mensagens =
      this.listarTodasMensagens()
        .filter(

          mensagem =>
            !idsRemovidos.includes(
              mensagem.solicitacaoId
            )

        );


    const bloqueios =
      this.listarBloqueios()
        .filter(

          bloqueio =>

            bloqueio.bloqueadorId !==
              usuarioId

            &&

            bloqueio.bloqueadoId !==
              usuarioId

        );


    this.salvarSolicitacoes(
      novasSolicitacoes
    );


    localStorage.setItem(

      this.chaveMensagens,

      JSON.stringify(
        mensagens
      )

    );


    this.salvarBloqueios(
      bloqueios
    );
  }


  private listarBloqueios():
    BloqueioUsuario[] {

    const valor =
      localStorage.getItem(
        this.chaveBloqueios
      );


    return valor
      ? JSON.parse(valor)
      : [];
  }


  private salvarBloqueios(
    bloqueios:
      BloqueioUsuario[]
  ): void {

    localStorage.setItem(

      this.chaveBloqueios,

      JSON.stringify(
        bloqueios
      )

    );
  }


  private excluirMensagensDaSolicitacao(
    solicitacaoId: number
  ): void {

    const mensagens =
      this.listarTodasMensagens()
        .filter(

          mensagem =>
            mensagem.solicitacaoId !==
            solicitacaoId

        );


    localStorage.setItem(

      this.chaveMensagens,

      JSON.stringify(
        mensagens
      )

    );
  }


  private excluirMensagensPorIds(
    solicitacoesIds: number[]
  ): void {

    const mensagens =
      this.listarTodasMensagens()
        .filter(

          mensagem =>
            !solicitacoesIds.includes(
              mensagem.solicitacaoId
            )

        );


    localStorage.setItem(

      this.chaveMensagens,

      JSON.stringify(
        mensagens
      )

    );
  }


  private listarTodasMensagens():
    MensagemChat[] {

    const valor =
      localStorage.getItem(
        this.chaveMensagens
      );


    return valor
      ? JSON.parse(valor)
      : [];
  }


  private salvarSolicitacoes(
    solicitacoes:
      SolicitacaoAdocao[]
  ): void {

    localStorage.setItem(

      this.chaveSolicitacoes,

      JSON.stringify(
        solicitacoes
      )

    );
  }
}