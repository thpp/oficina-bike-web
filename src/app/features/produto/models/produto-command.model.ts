import { TipoProduto } from '../enums/tipo-produto.enum';

export interface ProdutoCommand {
  descricao: string;
  codigoInterno: string;
  tipo: TipoProduto;
  precoCusto: number;
  precoVenda: number;
  estoqueAtual: number;
  estoqueMinimo: number;
}
