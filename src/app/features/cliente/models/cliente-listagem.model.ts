export interface ClienteListagem {
  id: string;
  nome: string;
  documento: string;
  email: string;
  telefone: string;
  cidade: string;
  ativo: boolean;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  page: number;
  size: number;
}
