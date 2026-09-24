import {
  CommonModule
} from '@angular/common';

import {
  Component
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
  PetService
} from '../../services/pet';

import {
  ComunidadeService
} from '../../services/comunidade';

import {
  Auth
} from '../../services/auth';

import {
  Post
} from '../../models/post.model';


@Component({
  selector: 'app-publicar',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    Menu,
    Footer
  ],

  templateUrl:
    './publicar.html',

  styleUrl:
    './publicar.css'
})
export class Publicar {

  tipo:
    'pet' |
    'post' =
      'pet';


  mensagem =
    '';


  /*
    FOTO DO ANIMAL
  */

  imagemSelecionada =
    '';


  nomeArquivo =
    '';


  /*
    IMAGEM DO POST
  */

  imagemPostSelecionada =
    '';


  nomeArquivoPost =
    '';


  pet = {

    nome:
      '',

    especie:
      'Cachorro' as
      'Cachorro' |
      'Gato',

    idade:
      '',

    porte:
      'Médio' as
      'Pequeno' |
      'Médio' |
      'Grande',

    sexo:
      'Macho' as
      'Macho' |
      'Fêmea',

    bairro:
      '',

    descricao:
      ''

  };


  post = {

    categoria:
      'Informação' as
      Post['categoria'],

    texto:
      ''

  };


  constructor(

    private petService:
      PetService,

    private comunidadeService:
      ComunidadeService,

    private auth:
      Auth

  ) {}


  /*
    FOTO DO ANIMAL
  */

  selecionarImagem(
    event: Event
  ): void {

    this.mensagem =
      '';


    const input =
      event.target as
      HTMLInputElement;


    const arquivo =
      input.files?.[0];


    if (!arquivo) {

      return;
    }


    if (
      !arquivo.type
        .startsWith(
          'image/'
        )
    ) {

      this.mensagem =
        'Selecione um arquivo de imagem.';


      input.value =
        '';


      return;
    }


    if (
      arquivo.size >
      1500000
    ) {

      this.mensagem =
        'A imagem do animal deve ter no máximo 1,5 MB.';


      input.value =
        '';


      return;
    }


    const leitor =
      new FileReader();


    leitor.onload =
      () => {

        this.imagemSelecionada =
          leitor.result as string;


        this.nomeArquivo =
          arquivo.name;

      };


    leitor.onerror =
      () => {

        this.mensagem =
          'Não foi possível carregar a imagem.';

      };


    leitor.readAsDataURL(
      arquivo
    );
  }


  removerImagem(): void {

    this.imagemSelecionada =
      '';


    this.nomeArquivo =
      '';
  }


  /*
    IMAGEM DO POST
  */

  selecionarImagemPost(
    event: Event
  ): void {

    this.mensagem =
      '';


    const input =
      event.target as
      HTMLInputElement;


    const arquivo =
      input.files?.[0];


    if (!arquivo) {

      return;
    }


    if (
      !arquivo.type
        .startsWith(
          'image/'
        )
    ) {

      this.mensagem =
        'Selecione um arquivo de imagem.';


      input.value =
        '';


      return;
    }


    /*
      Como usamos localStorage,
      deixamos a imagem do post
      limitada a 1 MB.
    */

    if (
      arquivo.size >
      1000000
    ) {

      this.mensagem =
        'A imagem do post deve ter no máximo 1 MB.';


      input.value =
        '';


      return;
    }


    const leitor =
      new FileReader();


    leitor.onload =
      () => {

        this.imagemPostSelecionada =
          leitor.result as string;


        this.nomeArquivoPost =
          arquivo.name;

      };


    leitor.onerror =
      () => {

        this.mensagem =
          'Não foi possível carregar a imagem do post.';

      };


    leitor.readAsDataURL(
      arquivo
    );
  }


  removerImagemPost(): void {

    this.imagemPostSelecionada =
      '';


    this.nomeArquivoPost =
      '';
  }


  /*
    PUBLICAR ANIMAL
  */

  publicarPet(): void {

    this.mensagem =
      '';


    const usuario =
      this.auth
        .usuarioAtual();


    if (!usuario) {

      this.mensagem =
        'Você precisa estar logado para publicar.';


      return;
    }


    if (

      !this.pet.nome.trim()

      ||

      !this.pet.idade.trim()

      ||

      !this.pet.bairro.trim()

      ||

      !this.pet.descricao.trim()

    ) {

      this.mensagem =
        'Preencha todos os campos do animal.';


      return;
    }


    let imagem =
      this.imagemSelecionada;


    if (!imagem) {

      imagem =

        this.pet.especie ===
        'Gato'

          ? 'img/luna.svg'

          : 'img/caramelo.svg';

    }


    this.petService
      .adicionar({

        ...this.pet,

        imagem:
          imagem,

        usuarioId:
          usuario.id,

        usuarioNome:
          usuario.nome,

        status:
          'Disponível',

        demonstrativo:
          false,

        compatibilidade: [

          'Adoção responsável',

          'Contato com responsável'

        ]

      });


    this.mensagem =
      'Animal publicado com sucesso.';


    this.pet = {

      nome:
        '',

      especie:
        'Cachorro',

      idade:
        '',

      porte:
        'Médio',

      sexo:
        'Macho',

      bairro:
        '',

      descricao:
        ''

    };


    this.imagemSelecionada =
      '';


    this.nomeArquivo =
      '';
  }


  /*
    PUBLICAR POST
  */

  publicarPost(): void {

    this.mensagem =
      '';


    const usuario =
      this.auth
        .usuarioAtual();


    if (!usuario) {

      this.mensagem =
        'Você precisa estar logado para publicar.';


      return;
    }


    if (
      !this.post.texto.trim()
    ) {

      this.mensagem =
        'Escreva o conteúdo da publicação.';


      return;
    }


    try {

      this.comunidadeService
        .adicionar(

          usuario.id,

          usuario.nome,

          this.post.categoria,

          this.post.texto,

          this.imagemPostSelecionada

        );


      this.post = {

        categoria:
          'Informação',

        texto:
          ''

      };


      this.imagemPostSelecionada =
        '';


      this.nomeArquivoPost =
        '';


      this.mensagem =
        'Publicação criada com sucesso.';

    } catch {

      this.mensagem =
        'Não foi possível salvar a publicação. Tente usar uma imagem menor.';

    }
  }
}