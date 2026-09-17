export interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha: string;
  aceitouLgpd: boolean;
}

export type UsuarioSessao = Pick<Usuario, 'id' | 'nome' | 'email'>;
