import {
  Injectable
} from '@angular/core';

import {
  Post
} from '../models/post.model';


@Injectable({
  providedIn: 'root'
})
export class ComunidadeService {

  private readonly chave =
    'adotassa_posts';


  private readonly iniciais:
    Post[] = [

    {
      id: 101,

      autor:
        'Projeto Patinhas SSA',

      categoria:
        'Evento',

      texto:
        'Feira de adoção neste sábado, das 10h às 16h. Venha conhecer animais que estão esperando por uma família.',

      curtidas:
        42,

      data:
        'Hoje',

      comentarios: [
        'Vou compartilhar com meus amigos!'
      ]
    },


    {
      id: 102,

      autor:
        'Rede Animal Salvador',

      categoria:
        'Ajuda',

      texto:
        'Estamos arrecadando ração e areia sanitária para animais resgatados. Toda contribuição ajuda muito.',

      curtidas:
        31,

      data:
        'Ontem',

      comentarios: []
    },


    {
      id: 103,

      autor:
        'AdotaSSA',

      categoria:
        'Informação',

      texto:
        'Antes de adotar, converse com todos que moram na casa e avalie tempo, espaço e custos. Adoção responsável é compromisso.',

      curtidas:
        58,

      data:
        '2 dias atrás',

      comentarios: [
        'Informação muito importante.'
      ]
    }

  ];


  listar(): Post[] {

    const valor =
      localStorage.getItem(
        this.chave
      );


    if (valor) {

      return JSON.parse(
        valor
      ) as Post[];

    }


    this.salvar(
      this.iniciais
    );


    return [
      ...this.iniciais
    ];
  }


  adicionar(
    usuarioId: number,
    autor: string,
    categoria: Post['categoria'],
    texto: string,
    imagem: string = ''
  ): void {

    const posts =
      this.listar();


    const novoPost: Post = {

      id:
        Date.now(),

      usuarioId:
        usuarioId,

      autor:
        autor,

      categoria:
        categoria,

      texto:
        texto.trim(),

      imagem:
        imagem,

      curtidas:
        0,

      data:
        'Agora',

      comentarios:
        []

    };


    posts.unshift(
      novoPost
    );


    this.salvar(
      posts
    );
  }


  listarDoUsuario(
    usuarioId: number
  ): Post[] {

    return this.listar()
      .filter(

        post =>
          post.usuarioId ===
          usuarioId

      );
  }


  excluirDoUsuario(
    id: number,
    usuarioId: number
  ): void {

    const posts =
      this.listar();


    const novosPosts =
      posts.filter(

        post =>
          post.id !== id ||
          post.usuarioId !==
            usuarioId

      );


    this.salvar(
      novosPosts
    );
  }


  curtir(
    id: number
  ): void {

    const posts =
      this.listar();


    const post =
      posts.find(

        item =>
          item.id === id

      );


    if (!post) {

      return;
    }


    post.curtidas +=
      1;


    this.salvar(
      posts
    );
  }


  comentar(
    id: number,
    comentario: string
  ): void {

    const texto =
      comentario.trim();


    if (!texto) {

      return;
    }


    const posts =
      this.listar();


    const post =
      posts.find(

        item =>
          item.id === id

      );


    if (!post) {

      return;
    }


    post.comentarios.push(
      texto
    );


    this.salvar(
      posts
    );
  }


  private salvar(
    posts: Post[]
  ): void {

    localStorage.setItem(

      this.chave,

      JSON.stringify(
        posts
      )

    );
  }
}