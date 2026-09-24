export type StatusSolicitacao =
  'Pendente' |
  'Aceita' |
  'Recusada' |
  'Cancelada' |
  'Concluída';


export interface SolicitacaoAdocao {

  id: number;

  petId: number;

  petNome: string;

  petImagem: string;

  doadorId: number;

  doadorNome: string;

  interessadoId: number;

  interessadoNome: string;

  interessadoEmail: string;

  status: StatusSolicitacao;

  criadaEm: string;
}


export interface MensagemChat {

  id: number;

  solicitacaoId: number;

  autorId: number;

  autorNome: string;

  texto: string;

  enviadaEm: string;
}