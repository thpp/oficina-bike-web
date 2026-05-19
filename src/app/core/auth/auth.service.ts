import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Permissao } from './permissao.enum';
import { TokenService } from './token.service';
import { UsuarioSessao } from './usuario-sessao.model';

interface LoginRequest {
  email: string;
  senha: string;
}

interface LoginResponse {
  accessToken: string;
  usuario: UsuarioSessao;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly usuarioSignal = signal<UsuarioSessao | null>(null);
  readonly usuario = this.usuarioSignal.asReadonly();

  constructor(
    private readonly http: HttpClient,
    private readonly tokenService: TokenService,
    private readonly router: Router
  ) {}

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiAuthUrl}/login`, request, { withCredentials: true }).pipe(
      tap((response) => {
        this.tokenService.definirAccessToken(response.accessToken);
        this.usuarioSignal.set(response.usuario);
      })
    );
  }

  usarSessaoMock(): void {
    this.tokenService.definirAccessToken('token-mock-local');
    this.usuarioSignal.set({
      id: '1',
      nome: 'Administrador',
      email: 'admin@oficinabike.local',
      perfil: 'ADMINISTRADOR',
      permissoes: Object.values(Permissao)
    });
  }

  estaAutenticado(): boolean {
    return !!this.usuarioSignal();
  }

  temPermissao(permissao: Permissao): boolean {
    return this.usuarioSignal()?.permissoes.includes(permissao) ?? false;
  }

  logout(): void {
    this.tokenService.limpar();
    this.usuarioSignal.set(null);
    void this.router.navigate(['/login']);
  }
}
