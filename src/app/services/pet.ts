import { Injectable } from '@angular/core';

import {
  Pet,
  StatusPet
} from '../models/pet.model';


@Injectable({
  providedIn: 'root'
})
export class PetService {

  private readonly chave =
    'adotassa_pets';


  private readonly iniciais: Pet[] = [

    {
      id: 1,

      nome: 'Caramelo',

      especie: 'Cachorro',

      idade: '2 anos',

      porte: 'Médio',

      sexo: 'Macho',

      bairro: 'Itapuã',

      descricao:
        'Dócil, brincalhão e muito companheiro. Procura uma família paciente e carinhosa.',

      imagem:
        'img/caramelo.svg',

      compatibilidade: [
        'Famílias',
        'Outros cães',
        'Passeios diários'
      ],

      status:
        'Disponível',

      demonstrativo:
        true
    },


    {
      id: 2,

      nome: 'Luna',

      especie: 'Gato',

      idade: '1 ano',

      porte: 'Pequeno',

      sexo: 'Fêmea',

      bairro: 'Brotas',

      descricao:
        'Curiosa, tranquila e acostumada com ambiente interno.',

      imagem:
        'img/luna.svg',

      compatibilidade: [
        'Apartamento',
        'Ambiente calmo',
        'Tela de proteção'
      ],

      status:
        'Disponível',

      demonstrativo:
        true
    },


    {
      id: 3,

      nome: 'Mel',

      especie: 'Cachorro',

      idade: '4 anos',

      porte: 'Grande',

      sexo: 'Fêmea',

      bairro: 'Cabula',

      descricao:
        'Muito afetuosa e protetora. Gosta de espaço e companhia.',

      imagem:
        'img/mel.svg',

      compatibilidade: [
        'Casa com espaço',
        'Adultos',
        'Rotina ativa'
      ],

      status:
        'Disponível',

      demonstrativo:
        true
    },


    {
      id: 4,

      nome: 'Nino',

      especie: 'Gato',

      idade: '3 anos',

      porte: 'Pequeno',

      sexo: 'Macho',

      bairro: 'Barra',

      descricao:
        'Sociável, carinhoso e adora ficar perto de pessoas.',

      imagem:
        'img/nino.svg',

      compatibilidade: [
        'Apartamento',
        'Famílias',
        'Outros gatos'
      ],

      status:
        'Disponível',

      demonstrativo:
        true
    }

  ];


  listar(): Pet[] {

    const armazenados =
      localStorage.getItem(
        this.chave
      );


    if (!armazenados) {

      this.salvar(
        this.iniciais
      );


      return [
        ...this.iniciais
      ];
    }


    try {

      const pets =
        JSON.parse(
          armazenados
        ) as Pet[];


      /*
        Corrige registros antigos.

        Antes não existia o campo
        demonstrativo nem o status.
      */

      const normalizados =
        pets.map(

          pet =>
            this.normalizarPet(
              pet
            )

        );


      /*
        Aqui removemos duplicações.

        Se existirem dois animais iguais
        e um deles possuir usuarioId,
        damos preferência à publicação
        que pertence ao usuário.
      */

      const semDuplicados =
        this.removerDuplicados(
          normalizados
        );


      this.salvar(
        semDuplicados
      );


      return semDuplicados;

    } catch {

      this.salvar(
        this.iniciais
      );


      return [
        ...this.iniciais
      ];
    }
  }


  adicionar(
    pet: Omit<Pet, 'id'>
  ): void {

    const pets =
      this.listar();


    const novoPet: Pet = {

      ...pet,

      id:
        Date.now(),

      status:
        pet.status ||
        'Disponível',

      demonstrativo:
        false

    };


    /*
      Evita publicação duplicada.

      Caso exista uma cópia antiga
      exatamente igual, ela é removida
      antes da nova publicação entrar.
    */

    const assinaturaNova =
      this.assinatura(
        novoPet
      );


    const petsSemCopia =
      pets.filter(

        petExistente => {

          if (
            petExistente.demonstrativo
          ) {

            return true;
          }


          return (
            this.assinatura(
              petExistente
            ) !==
            assinaturaNova
          );
        }

      );


    petsSemCopia.unshift(
      novoPet
    );


    this.salvar(
      petsSemCopia
    );
  }


  listarDoUsuario(
    usuarioId: number
  ): Pet[] {

    return this.listar().filter(

      pet =>
        pet.usuarioId ===
        usuarioId

    );
  }


  buscarPorId(
    petId: number
  ): Pet | undefined {

    return this.listar().find(

      pet =>
        pet.id === petId

    );
  }


  alterarStatus(
    petId: number,
    status: StatusPet
  ): void {

    const pets =
      this.listar();


    const pet =
      pets.find(

        item =>
          item.id === petId

      );


    if (!pet) {
      return;
    }


    pet.status =
      status;


    this.salvar(
      pets
    );
  }


  excluirDoUsuario(
    id: number,
    usuarioId: number
  ): void {

    const pets =
      this.listar();


    const novosPets =
      pets.filter(

        pet =>
          pet.id !== id ||
          pet.usuarioId !==
            usuarioId

      );


    this.salvar(
      novosPets
    );
  }


  private normalizarPet(
    pet: Pet
  ): Pet {

    return {

      ...pet,

      status:
        pet.status ||
        'Disponível',

      demonstrativo:
        pet.demonstrativo ??
        this.ehPetInicial(
          pet
        )

    };
  }


  private ehPetInicial(
    pet: Pet
  ): boolean {

    return (

      (
        pet.id === 1 &&
        pet.nome === 'Caramelo'
      )

      ||

      (
        pet.id === 2 &&
        pet.nome === 'Luna'
      )

      ||

      (
        pet.id === 3 &&
        pet.nome === 'Mel'
      )

      ||

      (
        pet.id === 4 &&
        pet.nome === 'Nino'
      )

    );
  }


  private removerDuplicados(
    pets: Pet[]
  ): Pet[] {

    const resultado:
      Pet[] = [];


    const encontrados =
      new Map<
        string,
        number
      >();


    for (
      const pet
      of pets
    ) {

      /*
        Os animais demonstrativos
        não entram nessa comparação.
      */

      if (
        pet.demonstrativo
      ) {

        resultado.push(
          pet
        );

        continue;
      }


      const assinatura =
        this.assinatura(
          pet
        );


      const indiceExistente =
        encontrados.get(
          assinatura
        );


      if (
        indiceExistente ===
        undefined
      ) {

        encontrados.set(

          assinatura,

          resultado.length

        );


        resultado.push(
          pet
        );


        continue;
      }


      const existente =
        resultado[
          indiceExistente
        ];


      /*
        Se uma cópia não possui dono
        e outra possui usuarioId,
        mantemos a publicação correta.
      */

      if (
        !existente.usuarioId &&
        pet.usuarioId
      ) {

        resultado[
          indiceExistente
        ] = pet;

      }
    }


    return resultado;
  }


  private assinatura(
    pet: Pet
  ): string {

    return [

      pet.nome,

      pet.especie,

      pet.idade,

      pet.porte,

      pet.sexo,

      pet.bairro,

      pet.descricao

    ]

      .map(
        valor =>
          String(valor)
            .trim()
            .toLowerCase()
      )

      .join('|');
  }


  private salvar(
    pets: Pet[]
  ): void {

    localStorage.setItem(

      this.chave,

      JSON.stringify(
        pets
      )

    );
  }
}