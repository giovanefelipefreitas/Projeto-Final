export interface Post {
  id: number;
  autor: string;
  categoria: 'ONG' | 'Evento' | 'Ajuda' | 'Informação';
  texto: string;
  curtidas: number;
  data: string;
  comentarios: string[];
}
