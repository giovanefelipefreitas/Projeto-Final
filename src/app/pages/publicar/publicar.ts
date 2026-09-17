import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Menu } from '../../componentes/menu/menu';
import { Footer } from '../../componentes/footer/footer';
import { PetService } from '../../services/pet';
import { ComunidadeService } from '../../services/comunidade';
import { Auth } from '../../services/auth';
import { Post } from '../../models/post.model';

@Component({
  selector: 'app-publicar',
  standalone: true,
  imports: [CommonModule, FormsModule, Menu, Footer],
  templateUrl: './publicar.html',
  styleUrl: './publicar.css'
})
export class Publicar {
  tipo: 'pet' | 'post' = 'pet';
  mensagem = '';

  pet = {
    nome: '',
    especie: 'Cachorro' as 'Cachorro' | 'Gato',
    idade: '',
    porte: 'Médio' as 'Pequeno' | 'Médio' | 'Grande',
    sexo: 'Macho' as 'Macho' | 'Fêmea',
    bairro: '',
    descricao: ''
  };

  post = {
    categoria: 'Informação' as Post['categoria'],
    texto: ''
  };

  constructor(
    private petService: PetService,
    private comunidadeService: ComunidadeService,
    private auth: Auth
  ) {}

  publicarPet(): void {
    this.mensagem = '';
    if (!this.pet.nome.trim() || !this.pet.idade.trim() || !this.pet.bairro.trim() || !this.pet.descricao.trim()) {
      this.mensagem = 'Preencha todos os campos do animal.';
      return;
    }

    const imagem = this.pet.especie === 'Gato' ? 'img/luna.svg' : 'img/caramelo.svg';

    this.petService.adicionar({
      ...this.pet,
      imagem,
      compatibilidade: ['Adoção responsável', 'Contato com responsável']
    });

    this.mensagem = 'Animal publicado com sucesso.';
    this.pet = { nome: '', especie: 'Cachorro', idade: '', porte: 'Médio', sexo: 'Macho', bairro: '', descricao: '' };
  }

  publicarPost(): void {
    this.mensagem = '';
    if (!this.post.texto.trim()) {
      this.mensagem = 'Escreva o conteúdo da publicação.';
      return;
    }

    const autor = this.auth.usuarioAtual()?.nome || 'Usuário AdotaSSA';
    this.comunidadeService.adicionar(autor, this.post.categoria, this.post.texto);
    this.post.texto = '';
    this.mensagem = 'Publicação criada com sucesso.';
  }
}
