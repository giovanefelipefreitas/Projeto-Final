export type StatusPet =
  'Disponível' |
  'Em processo de adoção' |
  'Adotado';


export interface Pet {

  id: number;

  nome: string;

  especie: 'Cachorro' | 'Gato';

  idade: string;

  porte:
    'Pequeno' |
    'Médio' |
    'Grande';

  sexo:
    'Macho' |
    'Fêmea';

  bairro: string;

  descricao: string;

  imagem: string;

  compatibilidade: string[];

  usuarioId?: number;

  usuarioNome?: string;

  status?: StatusPet;

  demonstrativo?: boolean;
}