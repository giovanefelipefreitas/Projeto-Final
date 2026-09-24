import { Injectable } from '@angular/core';

import {
  Pet
} from '../models/pet.model';

import {
  SolicitacaoAdocao,
  MensagemChat
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


  constructor(
    private petService:
      PetService
  ) {}


  criarSolicitacao(
    pet: Pet,
    interessado: UsuarioSessao
  ): {
    ok: boolean;
    mensagem: string;
  } {

    if (
      pet.demonstrativo
    ) {

      return {

        ok: false,

        mensagem:
          'Este animal é demonstrativo e não possui responsável cadastrado.'

      };
    }


    if (
      !pet.usuarioId
    ) {

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
            pet.id &&

          solicitacao.interessadoId ===
            interessado.id &&

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
          .toLocaleString(
            'pt-BR'
          )

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


  listar():
    SolicitacaoAdocao[] {

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


    /*
      Quando uma solicitação é aceita,
      as outras solicitações pendentes
      desse animal são recusadas.
    */

    solicitacoes.forEach(

      item => {

        if (

          item.petId ===
            solicitacao.petId &&

          item.id !==
            solicitacao.id &&

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
          'Esta conversa não pode mais ser cancelada.'

      };
    }


    solicitacao.status =
      'Cancelada';


    this.salvarSolicitacoes(
      solicitacoes
    );


    /*
      O animal volta para a página
      de adoção como disponível.
    */

    this.petService
      .alterarStatus(

        solicitacao.petId,

        'Disponível'

      );


    /*
      As mensagens daquela conversa
      são apagadas.
    */

    this.excluirMensagensDaSolicitacao(
      solicitacao.id
    );


    return {

      ok: true,

      mensagem:
        'Conversa cancelada. O animal está disponível para adoção novamente.'

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


  existeSolicitacaoAtiva(
    petId: number,
    usuarioId: number
  ): boolean {

    return this.listar().some(

      solicitacao =>

        solicitacao.petId ===
          petId &&

        solicitacao.interessadoId ===
          usuarioId &&

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