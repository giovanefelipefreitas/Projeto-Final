import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Menu } from '../../componentes/menu/menu';
import { Footer } from '../../componentes/footer/footer';
import { PetCard } from '../../componentes/pet-card/pet-card';
import { PetService } from '../../services/pet';
import { Pet } from '../../models/pet.model';

@Component({
  selector: 'app-adocao',
  standalone: true,
  imports: [CommonModule, FormsModule, Menu, Footer, PetCard],
  templateUrl: './adocao.html',
  styleUrl: './adocao.css'
})
export class Adocao {
  pets: Pet[] = [];
  busca = '';
  especie = '';
  bairro = '';

  constructor(private petService: PetService) {
    this.pets = this.petService.listar();
  }

  get bairros(): string[] {
    return [...new Set(this.pets.map(p => p.bairro))].sort();
  }

  get filtrados(): Pet[] {
    const busca = this.busca.trim().toLowerCase();
    return this.pets.filter(pet => {
      const combinaBusca = !busca || pet.nome.toLowerCase().includes(busca) || pet.bairro.toLowerCase().includes(busca);
      const combinaEspecie = !this.especie || pet.especie === this.especie;
      const combinaBairro = !this.bairro || pet.bairro === this.bairro;
      return combinaBusca && combinaEspecie && combinaBairro;
    });
  }
}
