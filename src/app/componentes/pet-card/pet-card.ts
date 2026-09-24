import {
  Component,
  Input,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  Router
} from '@angular/router';

import {
  Pet
} from '../../models/pet.model';

import {
  Auth
} from '../../services/auth';

import {
  AdocaoService
} from '../../services/adocao';


@Component({
  selector: 'app-pet-card',
  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl:
    './pet-card.html',

  styleUrl:
    './pet-card.css'
})
export class PetCard
  implements OnInit {

  @Input({
    required: true
  })

  pet!: Pet;


  interessado =
    false;


  ehMeuPet =
    false;


  bloqueadoPeloDoador =
    false;


  mensagem =
    '';


  constructor(

    private auth:
      Auth,

    private adocaoService:
      AdocaoService,

    private router:
      Router

  ) {}


  ngOnInit(): void {

    const usuario =
      this.auth.usuarioAtual();


    if (!usuario) {

      return;
    }


    this.ehMeuPet =

      this.pet.usuarioId ===
      usuario.id;


    this.interessado =

      this.adocaoService
        .existeSolicitacaoAtiva(

          this.pet.id,

          usuario.id

        );


    if (
      this.pet.usuarioId
    ) {

      this.bloqueadoPeloDoador =

        this.adocaoService
          .estaBloqueado(

            this.pet.usuarioId,

            usuario.id

          );

    }
  }


  demonstrarInteresse(): void {

    this.mensagem = '';


    const usuario =
      this.auth.usuarioAtual();


    if (!usuario) {

      this.router.navigate(
        ['/login']
      );

      return;
    }


    if (
      this.bloqueadoPeloDoador
    ) {

      this.mensagem =
        'Você não pode enviar uma solicitação para este responsável.';

      return;
    }


    const confirmou =
      confirm(

        `Deseja confirmar seu interesse em adotar ${this.pet.nome}?`

      );


    if (!confirmou) {

      return;
    }


    const resultado =
      this.adocaoService
        .criarSolicitacao(

          this.pet,

          usuario

        );


    this.mensagem =
      resultado.mensagem;


    if (
      resultado.ok
    ) {

      this.interessado =
        true;

    }
  }


  get botaoDesativado():
    boolean {

    return (

      this.pet.demonstrativo ===
        true

      ||

      this.ehMeuPet

      ||

      this.interessado

      ||

      this.bloqueadoPeloDoador

      ||

      this.pet.status ===
        'Em processo de adoção'

      ||

      this.pet.status ===
        'Adotado'

    );
  }


  get textoBotao():
    string {

    if (
      this.pet.demonstrativo ===
      true
    ) {

      return 'Animal demonstrativo';
    }


    if (
      this.ehMeuPet
    ) {

      return 'Sua publicação';
    }


    if (
      this.pet.status ===
      'Adotado'
    ) {

      return 'Adotado ❤️';
    }


    if (
      this.pet.status ===
      'Em processo de adoção'
    ) {

      return 'Em processo de adoção';
    }


    if (
      this.bloqueadoPeloDoador
    ) {

      return 'Indisponível para você';
    }


    if (
      this.interessado
    ) {

      return 'Interesse enviado ✓';
    }


    return 'Tenho interesse em adotar';
  }
}