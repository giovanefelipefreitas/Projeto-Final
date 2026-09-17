import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pet } from '../../models/pet.model';

@Component({
  selector: 'app-pet-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pet-card.html',
  styleUrl: './pet-card.css'
})
export class PetCard {
  @Input({ required: true }) pet!: Pet;
  interessado = false;

  demonstrarInteresse(): void {
    this.interessado = true;
  }
}
