import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ProdutoCommand } from '../models/produto-command.model';

@Injectable({ providedIn: 'root' })
export class ProdutoCommandService {
  private readonly baseUrl = `${environment.apiCoreUrl}/produtos`;

  constructor(private readonly http: HttpClient) {}

  criar(command: ProdutoCommand): Observable<void> {
    return this.http.post<void>(this.baseUrl, command);
  }

  atualizar(id: string, command: ProdutoCommand): Observable<void> {
    console.log('Atualizando produto mock:', id, command);
    return of(void 0);
    // return this.http.put<void>(`${this.baseUrl}/${id}`, command);
  }

  inativar(id: string): Observable<void> {
    console.log('Inativando produto mock:', id);
    return of(void 0);
    // return this.http.patch<void>(`${this.baseUrl}/${id}/inativar`, {});
  }
}
