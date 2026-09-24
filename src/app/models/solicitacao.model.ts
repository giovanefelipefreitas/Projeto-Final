export type StatusSolicitacao =
  'Pendente' |
  'Aceita' |
  'Recusada' |
  'Cancelada' |
  'Concluída' |
  'Bloqueada';


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


export interface BloqueioUsuario {

  id: number;

  bloqueadorId: number;

  bloqueadorNome: string;

  bloqueadoId: number;

  bloqueadoNome: string;

  bloqueadoEmail: string;

  bloqueadoEm: string;
}