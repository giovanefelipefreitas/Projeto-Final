import { Injectable } from '@angular/core';
import { Pet } from '../models/pet.model';

@Injectable({
  providedIn: 'root'
})
export class PetService {

  private readonly chave = 'adotassa_pets';

  private readonly iniciais: Pet[] = [
    {
      id: 1,
      nome: 'Caramelo',
      especie: 'Cachorro',
      idade: '2 anos',
      porte: 'Médio',
      sexo: 'Macho',
      bairro: 'Itapuã',
      descricao: 'Dócil, brincalhão e muito companheiro. Procura uma família paciente e carinhosa.',
      imagem: 'img/caramelo.svg',
      compatibilidade: [
        'Famílias',
        'Outros cães',
        'Passeios diários'
      ]
    },

    {
      id: 2,
      nome: 'Luna',
      especie: 'Gato',
      idade: '1 ano',
      porte: 'Pequeno',
      sexo: 'Fêmea',
      bairro: 'Brotas',
      descricao: 'Curiosa, tranquila e acostumada com ambiente interno.',
      imagem: 'img/luna.svg',
      compatibilidade: [
        'Apartamento',
        'Ambiente calmo',
        'Tela de proteção'
      ]
    },

    {
      id: 3,
      nome: 'Mel',
      especie: 'Cachorro',
      idade: '4 anos',
      porte: 'Grande',
      sexo: 'Fêmea',
      bairro: 'Cabula',
      descricao: 'Muito afetuosa e protetora. Gosta de espaço e companhia.',
      imagem: 'img/mel.svg',
      compatibilidade: [
        'Casa com espaço',
        'Adultos',
        'Rotina ativa'
      ]
    },

    {
      id: 4,
      nome: 'Nino',
      especie: 'Gato',
      idade: '3 anos',
      porte: 'Pequeno',
      sexo: 'Macho',
      bairro: 'Barra',
      descricao: 'Sociável, carinhoso e adora ficar perto de pessoas.',
      imagem: 'img/nino.svg',
      compatibilidade: [
        'Apartamento',
        'Famílias',
        'Outros gatos'
      ]
    }
  ];


  listar(): Pet[] {

    const armazenados = localStorage.getItem(this.chave);

    if (armazenados) {
      return JSON.parse(armazenados) as Pet[];
    }

    localStorage.setItem(
      this.chave,
      JSON.stringify(this.iniciais)
    );

    return [...this.iniciais];
  }


  adicionar(pet: Omit<Pet, 'id'>): void {

    const pets = this.listar();

    pets.unshift({
      ...pet,
      id: Date.now()
    });

    this.salvar(pets);
  }


  listarDoUsuario(usuarioId: number): Pet[] {

    return this.listar().filter(
      pet => pet.usuarioId === usuarioId
    );
  }


  excluirDoUsuario(id: number, usuarioId: number): void {

    const pets = this.listar();

    const novosPets = pets.filter(
      pet =>
        pet.id !== id ||
        pet.usuarioId !== usuarioId
    );

    this.salvar(novosPets);
  }


  private salvar(pets: Pet[]): void {

    localStorage.setItem(
      this.chave,
      JSON.stringify(pets)
    );
  }
}