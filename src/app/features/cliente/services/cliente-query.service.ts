import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ClienteDetalhe } from '../models/cliente-detalhe.model';
import { ClienteListagem, PageResponse } from '../models/cliente-listagem.model';

@Injectable({ providedIn: 'root' })
export class ClienteQueryService {
  private readonly baseUrl = `${environment.apiQueryUrl}/clientes`;

  constructor(private readonly http: HttpClient) {}

  listar(filtro: string, page = 0, size = 10): Observable<PageResponse<ClienteListagem>> {
    const clientes: ClienteListagem[] = [
      { id: '1', nome: 'Joao Silva', documento: '123.456.789-00', email: 'joao@email.com', telefone: '(11) 99999-0001', cidade: 'Sao Paulo', ativo: true },
      { id: '2', nome: 'Maria Oliveira', documento: '987.654.321-00', email: 'maria@email.com', telefone: '(21) 98888-0002', cidade: 'Rio de Janeiro', ativo: true },
      { id: '3', nome: 'Bike Express Ltda', documento: '12.345.678/0001-90', email: 'contato@bikeexpress.com', telefone: '(31) 3777-0003', cidade: 'Belo Horizonte', ativo: true }
    ].filter(c => !filtro || c.nome.toLowerCase().includes(filtro.toLowerCase()) || c.documento.includes(filtro));

    return of({ content: clientes, totalElements: clientes.length, page, size });

    // const params = new HttpParams().set('filtro', filtro).set('page', page).set('size', size);
    // return this.http.get<PageResponse<ClienteListagem>>(this.baseUrl, { params });
  }

  buscarPorId(id: string): Observable<ClienteDetalhe> {
    return of({
      id,
      nome: 'Joao Silva',
      documento: '123.456.789-00',
      email: 'joao@email.com',
      telefone: '(11) 99999-0001',
      cidade: 'Sao Paulo',
      observacao: 'Cliente recorrente para revisoes.',
      ativo: true
    });

    // return this.http.get<ClienteDetalhe>(`${this.baseUrl}/${id}`);
  }
}
