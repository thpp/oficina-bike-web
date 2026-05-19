import { TipoProduto } from '../enums/tipo-produto.enum';

export interface ProdutoListagem {
  id: string;
  descricao: string;
  tipo: TipoProduto;
  precoVenda: number;
  estoqueAtual: number;
  ativo: boolean;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  page: number;
  size: number;
}
