import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PetService } from '../../services/pet';
import { Pet } from '../../models/pet.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './carousel.html',
  styleUrl: './carousel.css'
})
export class Carousel {
  pets: Pet[] = [];
  indice = 0;

  constructor(private petService: PetService) {
    this.pets = this.petService.listar().slice(0, 4);
  }

  get atual(): Pet | null {
    return this.pets[this.indice] ?? null;
  }

  proximo(): void {
    if (!this.pets.length) return;
    this.indice = (this.indice + 1) % this.pets.length;
  }

  anterior(): void {
    if (!this.pets.length) return;
    this.indice = (this.indice - 1 + this.pets.length) % this.pets.length;
  }
}
