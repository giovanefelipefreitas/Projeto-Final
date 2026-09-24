import {
  CommonModule
} from '@angular/common';

import {
  Component,
  HostListener
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  Menu
} from '../../componentes/menu/menu';

import {
  Footer
} from '../../componentes/footer/footer';

import {
  PetCard
} from '../../componentes/pet-card/pet-card';

import {
  PetService
} from '../../services/pet';

import {
  Pet
} from '../../models/pet.model';


@Component({
  selector: 'app-adocao',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    Menu,
    Footer,
    PetCard
  ],

  templateUrl:
    './adocao.html',

  styleUrl:
    './adocao.css'
})
export class Adocao {

  pets:
    Pet[] = [];


  busca =
    '';


  especie =
    '';


  bairro =
    '';


  constructor(
    private petService:
      PetService
  ) {

    this.carregarPets();
  }


  carregarPets(): void {

    this.pets =
      this.petService.listar();
  }


  /*
    Atualiza os animais automaticamente
    quando outra aba alterar o localStorage.
  */

  @HostListener(
    'window:storage',
    ['$event']
  )
  quandoLocalStorageMudar(
    event: StorageEvent
  ): void {

    if (
      event.key ===
      'adotassa_pets'
    ) {

      this.carregarPets();

    }
  }


  get filtrados():
    Pet[] {

    const buscaDigitada =
      this.busca
        .trim()
        .toLowerCase();


    const bairroDigitado =
      this.bairro
        .trim()
        .toLowerCase();


    return this.pets.filter(

      pet => {


        /*
          FILTRO PELO NOME
        */

        const combinaBusca =

          !buscaDigitada

          ||

          pet.nome
            .toLowerCase()
            .includes(
              buscaDigitada
            );


        /*
          FILTRO PELA ESPÉCIE
        */

        const combinaEspecie =

          !this.especie

          ||

          pet.especie ===
            this.especie;


        /*
          FILTRO PELO BAIRRO

          Não precisa digitar o nome
          inteiro do bairro.
        */

        const combinaBairro =

          !bairroDigitado

          ||

          pet.bairro
            .toLowerCase()
            .includes(
              bairroDigitado
            );


        return (

          combinaBusca

          &&

          combinaEspecie

          &&

          combinaBairro

        );

      }

    );
  }
}