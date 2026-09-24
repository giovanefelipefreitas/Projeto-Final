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


  get bairros():
    string[] {

    return [

      ...new Set(

        this.pets.map(
          pet =>
            pet.bairro
        )

      )

    ].sort();
  }


  get filtrados():
    Pet[] {

    const busca =
      this.busca
        .trim()
        .toLowerCase();


    return this.pets.filter(

      pet => {

        const combinaBusca =

          !busca

          ||

          pet.nome
            .toLowerCase()
            .includes(
              busca
            )

          ||

          pet.bairro
            .toLowerCase()
            .includes(
              busca
            );


        const combinaEspecie =

          !this.especie

          ||

          pet.especie ===
            this.especie;


        const combinaBairro =

          !this.bairro

          ||

          pet.bairro ===
            this.bairro;


        return (

          combinaBusca &&

          combinaEspecie &&

          combinaBairro

        );
      }

    );
  }
}