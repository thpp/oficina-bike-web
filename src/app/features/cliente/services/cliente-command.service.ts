import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ClienteCommand } from '../models/cliente-command.model';

@Injectable({ providedIn: 'root' })
export class ClienteCommandService {
  private readonly baseUrl = `${environment.apiCoreUrl}/clientes`;

  constructor(private readonly http: HttpClient) {}

  criar(command: ClienteCommand): Observable<void> {
      return this.http.post<void>(this.baseUrl, command);
  }

  atualizar(id: string, command: ClienteCommand): Observable<void> {
    console.log('Atualizando cliente mock:', id, command);
    return of(void 0);
    // return this.http.put<void>(`${this.baseUrl}/${id}`, command);
  }

  excluir(id: string): Observable<void> {
    console.log('Excluindo cliente mock:', id);
    return of(void 0);
    // return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
