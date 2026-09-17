import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Menu } from '../../componentes/menu/menu';
import { Footer } from '../../componentes/footer/footer';
import { Post } from '../../models/post.model';
import { ComunidadeService } from '../../services/comunidade';

@Component({
  selector: 'app-comunidade',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, Menu, Footer],
  templateUrl: './comunidade.html',
  styleUrl: './comunidade.css'
})
export class Comunidade {
  posts: Post[] = [];
  comentarios: Record<number, string> = {};

  constructor(private comunidadeService: ComunidadeService) {
    this.recarregar();
  }

  curtir(id: number): void {
    this.comunidadeService.curtir(id);
    this.recarregar();
  }

  comentar(id: number): void {
    this.comunidadeService.comentar(id, this.comentarios[id] || '');
    this.comentarios[id] = '';
    this.recarregar();
  }

  private recarregar(): void {
    this.posts = this.comunidadeService.listar();
  }
}
