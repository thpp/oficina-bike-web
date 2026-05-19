import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ProdutoDetalhe } from '../models/produto-detalhe.model';
import { PageResponse, ProdutoListagem } from '../models/produto-listagem.model';
import { TipoProduto } from '../enums/tipo-produto.enum';

@Injectable({ providedIn: 'root' })
export class ProdutoQueryService {
  private readonly baseUrl = `${environment.apiQueryUrl}/produtos`;

  constructor(private readonly http: HttpClient) {}

  listar(filtro: string, page = 0, size = 10): Observable<PageResponse<ProdutoListagem>> {
    // Troque o mock abaixo pela chamada real quando o backend estiver pronto.
    const produtos: ProdutoListagem[] = [
      { id: '1', descricao: 'Corrente Shimano 12v', tipo: TipoProduto.PECA, precoVenda: 89.9, estoqueAtual: 12, ativo: true },
      { id: '2', descricao: 'Bicicleta Urbana Aro 29', tipo: TipoProduto.BICICLETA, precoVenda: 1890, estoqueAtual: 2, ativo: true },
      { id: '3', descricao: 'Revisão Completa', tipo: TipoProduto.SERVICO, precoVenda: 150, estoqueAtual: 0, ativo: true }
    ].filter(p => !filtro || p.descricao.toLowerCase().includes(filtro.toLowerCase()));

    return of({ content: produtos, totalElements: produtos.length, page, size });

    // Exemplo real:
    // const params = new HttpParams().set('filtro', filtro).set('page', page).set('size', size);
    // return this.http.get<PageResponse<ProdutoListagem>>(this.baseUrl, { params });
  }

  buscarPorId(id: string): Observable<ProdutoDetalhe> {
    // Mock local para desenvolvimento inicial.
    return of({
      id,
      descricao: 'Corrente Shimano 12v',
      codigoInterno: 'PRD-001',
      tipo: TipoProduto.PECA,
      precoCusto: 50,
      precoVenda: 89.9,
      estoqueAtual: 12,
      estoqueMinimo: 3,
      ativo: true
    });

    // return this.http.get<ProdutoDetalhe>(`${this.baseUrl}/${id}`);
  }
}
