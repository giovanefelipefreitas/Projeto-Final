import { Injectable } from '@angular/core';
import { Post } from '../models/post.model';

@Injectable({ providedIn: 'root' })
export class ComunidadeService {
  private readonly chave = 'adotassa_posts';

  private readonly iniciais: Post[] = [
    {
      id: 101,
      autor: 'Projeto Patinhas SSA',
      categoria: 'Evento',
      texto: 'Feira de adoção neste sábado, das 10h às 16h. Venha conhecer animais que estão esperando por uma família.',
      curtidas: 42,
      data: 'Hoje',
      comentarios: ['Vou compartilhar com meus amigos!']
    },
    {
      id: 102,
      autor: 'Rede Animal Salvador',
      categoria: 'Ajuda',
      texto: 'Estamos arrecadando ração e areia sanitária para animais resgatados. Toda contribuição ajuda muito.',
      curtidas: 31,
      data: 'Ontem',
      comentarios: []
    },
    {
      id: 103,
      autor: 'AdotaSSA',
      categoria: 'Informação',
      texto: 'Antes de adotar, converse com todos que moram na casa e avalie tempo, espaço e custos. Adoção responsável é compromisso.',
      curtidas: 58,
      data: '2 dias atrás',
      comentarios: ['Informação muito importante.']
    }
  ];

  listar(): Post[] {
    const valor = localStorage.getItem(this.chave);
    if (valor) return JSON.parse(valor) as Post[];

    localStorage.setItem(this.chave, JSON.stringify(this.iniciais));
    return [...this.iniciais];
  }

  adicionar(autor: string, categoria: Post['categoria'], texto: string): void {
    const posts = this.listar();
    posts.unshift({
      id: Date.now(),
      autor,
      categoria,
      texto: texto.trim(),
      curtidas: 0,
      data: 'Agora',
      comentarios: []
    });
    this.salvar(posts);
  }

  curtir(id: number): void {
    const posts = this.listar();
    const post = posts.find(p => p.id === id);
    if (post) {
      post.curtidas += 1;
      this.salvar(posts);
    }
  }

  comentar(id: number, comentario: string): void {
    const texto = comentario.trim();
    if (!texto) return;

    const posts = this.listar();
    const post = posts.find(p => p.id === id);
    if (post) {
      post.comentarios.push(texto);
      this.salvar(posts);
    }
  }

  private salvar(posts: Post[]): void {
    localStorage.setItem(this.chave, JSON.stringify(posts));
  }
}
